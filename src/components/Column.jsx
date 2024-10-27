import { useContext } from "react";
import Card from "./Card";
import { DataContext } from "../DataContext";
import { produce } from "immer";

const Column = ({ title, tasks = [], columnID, columnIndex }) => {
  const { setData, selectBoardIndex } = useContext(DataContext);

  const updateColumnsArray = (Data, selectBoardIndex, columnID) => {
    return Data[selectBoardIndex].columns.map((column) => {
      if (column.id === columnID) {
        return {
          ...column,
          tasks: [
            ...column.tasks,
            {
              id: Date.now(),
              title: "New Task",
            },
          ],
        };
      }
      return column;
    });
  };

  const addNewTaskHandler = () => {
    setData((prev) => {
      let newData = produce(prev, (draft) => {
        draft[selectBoardIndex].columns = updateColumnsArray(
          draft,
          selectBoardIndex,
          columnID,
        );
      });

      return newData;
    });
  };

  const onDeleteHandler = () => {
    if (window.confirm(`Are you sure you want to delete "${title}" column`)) {
      setData((prev) => {
        let newData = produce(prev, (draft) => {
          draft[selectBoardIndex].columns = draft[
            selectBoardIndex
          ].columns.filter((column) => column.id !== columnID);
        });
        return newData;
      });
    }
  };

  return (
    <div className="flex w-72 shrink-0 flex-col self-start rounded-lg bg-lines-light px-2 shadow">
      <h2 className="group/column relative px-2 py-4 text-heading-s">
        {title} ({tasks.length})
        <button
          className="absolute bottom-0 right-0 top-0 p-2 text-body-m text-red opacity-0 duration-300 focus:opacity-100 group-hover/column:opacity-100 peer-focus:opacity-100"
          onClick={onDeleteHandler}
        >
          Delete
        </button>
      </h2>
      <div className="mb-5 flex flex-col gap-5">
        {tasks.map((task, index) => (
          <Card
            key={task.id}
            title={task.title}
            taskID={task.id}
            columnID={columnID}
            taskIndex={index}
            columnIndex={columnIndex}
          />
        ))}
      </div>
      <button
        onClick={addNewTaskHandler}
        className="mx-2 mt-auto border-t border-light-grey px-2 py-4 text-heading-m text-medium-grey"
      >
        + Add New Task
      </button>
    </div>
  );
};
export default Column;
