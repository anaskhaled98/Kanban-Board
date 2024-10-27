import { useContext, useState } from "react";
import { DataContext } from "../DataContext";
import { produce } from "immer";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Card = ({ title, taskID, columnID, taskIndex, columnIndex }) => {
  const { data, setData, selectBoardIndex } = useContext(DataContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: taskID,
      data: { columnID },
    });

  const updateColumnsArray = (newData, selectBoardIndex, columnID) => {
    return newData[selectBoardIndex].columns.map((column) => {
      if (column.id === columnID) {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskID),
        };
      }
      return column;
    });
  };

  const onDeleteHandler = () => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      setData((prev) => {
        let newData = [...prev];

        newData[selectBoardIndex] = {
          ...newData[selectBoardIndex],
          columns: updateColumnsArray(data, selectBoardIndex, columnID),
        };
        return newData;
      });
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(true);
  };

  const onFocusHandler = (e) => {
    e.target.select();
  };

  const onBlurHandler = (e) => {
    setIsEditMode(false);

    if (e.target.value.trim() === title) return;

    // Set data using only Immer and Index instead of IDs WOW !!😮
    setData((prev) =>
      produce(prev, (draft) => {
        draft[selectBoardIndex].columns[columnIndex].tasks[taskIndex].title =
          e.target.value.trim();
      }),
    );
  };

  const onKeyDownHandler = (e) => {
    e.key === "Enter" && onBlurHandler(e);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group/card relative min-h-16 overflow-y-hidden rounded-lg bg-white px-4 py-3 shadow-sm"
    >
      {isEditMode ? (
        <textarea
          className="h-full resize-none text-heading-m outline-light-grey"
          defaultValue={title}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onKeyDown={onKeyDownHandler}
          autoFocus
        ></textarea>
      ) : (
        <button
          onClick={toggleEditMode}
          className="peer h-full text-start text-heading-m"
        >
          {title}
        </button>
      )}
      <button
        className="absolute bottom-0 right-0 top-0 bg-white p-2 text-body-m text-red opacity-0 shadow duration-300 focus:opacity-100 group-hover/card:opacity-100 peer-focus:opacity-100"
        onClick={onDeleteHandler}
      >
        Delete
      </button>
    </div>
  );
};

export default Card;
