import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";

/**
 * DropdownPrimitive component
 * @param {object} props
 * @param {function} props.triggerComponent
 * @param {object} props.items
 * @param {string} props.items.label
 * @param {function} props.items.onClick
 * @returns {JSX.Element}
 */

const DropdownPrimitive = ({ triggerComponent, items }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {triggerComponent && triggerComponent()}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-48 rounded-lg bg-white shadow will-change-[opacity,transform]"
          sideOffset={32}
        >
          {items &&
            Object.keys(items).map((item) => (
              <DropdownMenu.Item
                className={clsx(
                  "group cursor-pointer p-4 text-body-l leading-none outline-none data-[highlighted]:bg-light-grey",
                  {
                    "text-red": items[item].label.includes("Delete"),
                  },
                )}
                key={items[item].label}
                onClick={items[item].onClick}
              >
                {items[item].label}
              </DropdownMenu.Item>
            ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DropdownPrimitive;
