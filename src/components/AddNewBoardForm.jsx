import TextField from "./TextField";
import iconCross from "../assets/icon_cross.svg";
import Button from "./Button";
import { useContext, useState } from "react";
import { DataContext } from "../DataContext";

const AddNewBoardForm = ({
  toggleDialog,
  boardID,
  columns = [{ id: Date.now() }],
  title,
}) => {
  const { setData, setSelectBoardIndex } = useContext(DataContext);

  const [columnsArray, setColumnsArray] = useState(columns);

  const removeColumnHandler = (id) => {
    setColumnsArray((prev) => prev.filter((column) => id !== column.id));
  };

  const addCloumnHandler = () => {
    setColumnsArray((prev) => [...prev, { id: Date.now() }]);
  };

  const createNewColumnsArray = (columnsArray, formData, boardID) => {
    return columnsArray.map((column) => {
      const tasksData = boardID ? column.tasks : [];
      return {
        id: column.id,
        title: formData.get(column.id),
        tasks: tasksData,
      };
    });
  };

  const updateData = (boardName, newColumnsArray, setData, boardID) => {
    setData((prev) => {
      let newData;
      if (boardID) {
        newData = prev.map((board) => {
          if (board.id === boardID) {
            return {
              ...board,
              title: boardName,
              columns: newColumnsArray,
            };
          }
          return board;
        });
      } else {
        newData = [
          ...prev,
          { id: Date.now(), title: boardName, columns: newColumnsArray },
        ];
        setSelectBoardIndex(prev.length);
      }
      return newData;
    });
  };

  // Another Solution to how we can update selected board in side minu

  // const updateSelectedBoard = (Data, setSelectBoardIndex) => {
  //   Data.map((_, index) => {
  //     if (index === Data.length - 1) setSelectBoardIndex(index);
  //   });
  // };
  // useEffect(() => {
  //   updateSelectedBoard(data (from contextAPI), setSelectBoardIndex);
  // }, [data]);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const boardName = formData.get("boardName");
    const newColumnsArray = createNewColumnsArray(
      columnsArray,
      formData,
      boardID,
    );

    updateData(boardName, newColumnsArray, setData, boardID);
    toggleDialog(false);
  };

  return (
    <form onSubmit={formSubmitHandler}>
      <div>
        <h3 className="pb-2 pt-6 text-body-m text-medium-grey">Name</h3>
        <TextField
          placeholder="e.g. Web Design"
          name="boardName"
          defaultValue={title}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="pt-6 text-body-m text-medium-grey">Columns</h3>
        {columnsArray.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <TextField
              placeholder="e.g. Web Design"
              name={item.id}
              defaultValue={item.title}
              required
            />
            <button type="button" onClick={() => removeColumnHandler(item.id)}>
              <img src={iconCross} alt="icon cross" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addCloumnHandler}
        >
          + Add New Column
        </Button>
      </div>
      <div className="mt-6">
        <Button type="submit" variant="primary" size="sm" isFullWidth>
          {boardID ? "Edit" : "Create"} New Board
        </Button>
      </div>
    </form>
  );
};

export default AddNewBoardForm;
