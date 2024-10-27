import clsx from "clsx";
import { useContext, useState } from "react";
import DialogPrimitive from "./DialogPrimitive";
import iconBoard from "../assets/icon-Board.svg";
import { DataContext } from "../DataContext";
import AddNewBoardForm from "./AddNewBoardForm";

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, selectBoardIndex, setSelectBoardIndex } =
    useContext(DataContext);

  return (
    <aside className="-mt-px w-[300px] border-r border-lines-light bg-white">
      <p className="px-8 py-4 text-heading-s">All Boards ({data?.length})</p>
      <ul>
        {data?.map((item, index) => (
          <li key={item.id}>
            <button
              className={clsx(
                "flex w-11/12 items-center gap-4 rounded-e-full px-8 py-4 text-heading-m text-medium-grey transition data-[isactive=false]:hover:bg-main-purple/10 data-[isactive=false]:hover:text-main-purple",
                {
                  "bg-main-purple !text-white hover:bg-main-purple":
                    selectBoardIndex === index,
                },
              )}
              onClick={() => setSelectBoardIndex(index)}
              data-isactive={selectBoardIndex === index}
            >
              <img src={iconBoard} alt="icon board" />
              {item.title}
            </button>
          </li>
        ))}
        <li className="">
          <DialogPrimitive
            title="Edit Board"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerComponent={
              <button className="flex w-full items-center gap-4 px-8 py-4 text-heading-m text-main-purple">
                <img src={iconBoard} alt="icon board" /> + Create New Board
              </button>
            }
          >
            <AddNewBoardForm toggleDialog={setIsOpen} />
          </DialogPrimitive>
        </li>
      </ul>
    </aside>
  );
};

export default SideMenu;
