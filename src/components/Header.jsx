import DropdownPrimitive from "./DropdownPrimitive";
import DialogPrimitive from "./DialogPrimitive";
import iconVerticalEllipsis from "../assets/icon-vertical-ellipsis.svg";
import { useContext, useState } from "react";
import { DataContext } from "../DataContext";
import AddNewBoardForm from "./AddNewBoardForm";

const Header = () => {
  const { data, setData, selectBoardIndex } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  const onEditBoard = () => setIsOpen(true);

  const onDeleteBoard = () => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      setData((prev) => prev.toSpliced(selectBoardIndex, 1));
    }
  };

  return (
    <header className="flex h-[97px] items-center">
      <div className="flex w-[300px] items-center self-stretch border-b border-r border-lines-light pl-8 text-[32px] font-bold">
        Kanban
      </div>
      <div className="flex flex-1 items-center justify-between self-stretch border-b border-lines-light pl-6 pr-6">
        <h2 className="text-heading-xl">Platform Launch</h2>
        <DropdownPrimitive
          items={{
            edit: {
              label: "Edit Board",
              onClick: onEditBoard,
            },
            delete: {
              label: "Delete Board",
              onClick: onDeleteBoard,
            },
          }}
          triggerComponent={() => (
            <button className="flex h-10 w-10 items-center justify-center">
              <img src={iconVerticalEllipsis} alt="icon vertical ellipsis" />
            </button>
          )}
        />
        <DialogPrimitive
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Edit Board"
        >
          <AddNewBoardForm
            toggleDialog={setIsOpen}
            boardID={data[selectBoardIndex]?.id}
            columns={data[selectBoardIndex]?.columns}
            title={data[selectBoardIndex]?.title}
          />
        </DialogPrimitive>
      </div>
    </header>
  );
};

export default Header;
