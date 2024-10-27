import { useContext, useMemo } from "react";
import Column from "./Column";
import { DataContext } from "../DataContext";
import { produce } from "immer";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const WorkSpcace = () => {
  const { data, setData, selectBoardIndex } = useContext(DataContext);
  const columns = data[selectBoardIndex]?.columns;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const createNewColumn = (num) => {
    return {
      id: Date.now(),
      title: `New Column ${num}`,
      tasks: [],
    };
  };

  const addColumnHandler = () => {
    const num = data[selectBoardIndex].columns.length;
    const newColumn = createNewColumn(num);

    setData((prev) => {
      // Using Immer library to simplifies handling immutable data structures
      let newData = produce(prev, (draft) => {
        draft[selectBoardIndex].columns.push(newColumn);
      });

      /*  newData[selectBoardIndex] = {
        ...newData[selectBoardIndex],
        columns: [...newData[selectBoardIndex].columns, newColumn],
      };*/

      // Another solution to how make a (DEEP COPY)
      /*newData[selectBoardIndex] = JSON.parse(
        JSON.stringify(newData[selectBoardIndex]),
      );
      newData[selectBoardIndex].columns = [
        ...newData[selectBoardIndex].columns,
        newColumn,
      ];*/

      return newData;
    });
  };

  const tasksIds = useMemo(() => {
    let tasksIds = [];

    if (!columns || columns.length === 0) return tasksIds;
    for (let column of columns) {
      tasksIds = [...tasksIds, ...column.tasks.map((task) => task.id)];
    }

    return tasksIds;
  }, [columns]);

  const onDragEndHandler = (event) => {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over.id;
    const overColumnId = over.data.current.columnID;
    const activeColumnId = active.data.current.columnID;

    if (activeId === overId) return;

    if (activeColumnId === overColumnId) {
      const newColumns = columns.map((column) => {
        if (column.id === activeColumnId) {
          const activeIdIndex = column.tasks.findIndex(
            (task) => task.id === activeId,
          );
          const overIdIndex = column.tasks.findIndex(
            (task) => task.id === overId,
          );
          const tasks = arrayMove(column.tasks, activeIdIndex, overIdIndex);

          return { ...column, tasks };
        }
        return column;
      });

      setData((prev) =>
        produce(prev, (draft) => {
          draft[selectBoardIndex].columns = newColumns;
        }),
      );
    }
  };

  const onDragOverHandler = (event) => {
    const { active, over } = event;
    const activeId = active.id;

    const overColumnId = over?.data?.current?.columnID;
    const activeColumnId = active?.data?.current?.columnID;

    if (overColumnId && activeColumnId !== overColumnId) {
      const newColumns = columns.map((column) => {
        // if the column is the column that the card is dragged to then add the task to the column
        if (column.id === overColumnId) {
          // get the active task from the active column's tasks
          const activeTask = columns
            .find((column) => column.id === activeColumnId)
            .tasks.find((task) => task.id === activeId);
          // add the active task to the end of the new column's tasks because the dnd lib will handle the reordering
          const tasks = [...column.tasks, activeTask];

          return { ...column, tasks };
        }

        // if the column is the column that the card is dragged from then remove the task from the column
        if (column.id === activeColumnId) {
          const tasks = column.tasks.filter((task) => task.id !== activeId);

          return { ...column, tasks };
        }

        return column;
      });

      setData((prev) =>
        produce(prev, (draft) => {
          draft[selectBoardIndex].columns = newColumns;
        }),
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEndHandler}
      onDragOver={onDragOverHandler}
    >
      <div className="flex h-[calc(100vh-97px)] flex-1 gap-5 overflow-auto bg-light-grey p-6">
        <SortableContext
          items={tasksIds}
          strategy={verticalListSortingStrategy}
        >
          {columns?.length > 0 &&
            columns.map((item, index) => (
              <Column
                key={item.id}
                columnID={item.id}
                title={item.title}
                tasks={item.tasks}
                columnIndex={index}
              />
            ))}
        </SortableContext>
        <button
          onClick={addColumnHandler}
          className="text-me w-72 shrink-0 self-start rounded-md bg-lines-light p-3 text-heading-l text-medium-grey"
        >
          + New Column
        </button>
      </div>
    </DndContext>
  );
};
export default WorkSpcace;
