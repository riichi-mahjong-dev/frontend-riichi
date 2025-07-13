import { useLocation, useNavigate } from "@solidjs/router";
import { JSX, createEffect, createSignal, For, children, Component } from "solid-js"
import MenuItem from "./MenuItem";
import { Header } from "../container/Header";
import { useAdmin } from "../context/AdminContext";

type MenuItemType = {
    icon: Component;
    label: string;
    to: string;
    path: string[];
}

type SideMenuProps = {
  children: JSX.Element;
  className?: string;
  menus?: MenuItemType[];
  menuSelected: number;
  OnMenuSelected: (menu: number) => void;
}

export default function SideMenu(props: SideMenuProps) {
  const [_, setAdmin] = useAdmin();
  const navigation = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = createSignal<boolean>(false);
  const [activeStyle, setActiveStyle] = createSignal<{top: number; height: number;}>({top: 0, height: 0});

  const menuRefMap: Record<number, HTMLDivElement | undefined> = {};

  createEffect(() => {
    const path = location.pathname;
    const activeIndex = props.menus?.findIndex(menu => {
      return menu.path.some((pattern) => {
        try {
          const regex = RegExp(pattern);
          return regex.test(path);
        } catch (e) {
          return false;
        }
      });
    }) ?? -1;

    if (activeIndex !== -1) {
      const menuElement = menuRefMap[activeIndex];
      const size = 30;
      if (menuElement) {
        setActiveStyle({
          top: menuElement.offsetTop - size / 2,
          height: menuElement.offsetHeight + size,
        });
      }

      if (props.menus) {
          setAdmin({
            selectedLabel: props.menus[activeIndex ?? 0].label,
          })
      }
    }

    window.scrollTo(0, 0);
  });

  return (
    <div class={`w-full h-screen ${props.className}`}>
      <Header
          onToggle={(toggle) => {
              setIsOpen(toggle);
          }}
          toggle={isOpen}
      >
      </Header>
      <div
          class={
              `fixed transform transition-transform duration-200 ease-in-out z-40 flex pt-3.5 w-[80vw] md:w-sidebar h-screen bg-white md:translate-x-0 -translate-x-full ${isOpen() ? 'translate-x-0' : '-translate-x-full'}`
          }
      >
      <div class="relative">
        <div class="flex flex-col gap-9-5 pt-5">
          <For each={props.menus}>
            {({ label, icon, to, path }, index) => {
              const isSelected = () => {
                const pathLocation = location.pathname;
                return path.some((pattern) => {
                  try {
                    const regex = RegExp(pattern);
                    return regex.test(pathLocation);
                  } catch (e) {
                    return false;
                  }
                });
              };
              return (
                <div ref={(el) => (menuRefMap[index()] = el)}>
                  <MenuItem
                    label={label}
                    Icon={icon}
                    selected={isSelected}
                    onClick={async () => {
                      navigation(to);
                      props.OnMenuSelected(index());
                      setIsOpen(false);
                      setAdmin({
                        selectedLabel: label,
                      });
                    }}
                  />
                </div>
              );
            }}
          </For>
        </div>
        <div
          class="absolute left-0 w-1 h-h-3 bg-black rounded-tr-lg rounded-br-lg transition-all duration-300"
          style={{
            top: `${activeStyle().top}px`,
            height: `${activeStyle().height}px`,
          }}
        ></div>
        </div>
        </div>
        <div class="w-full h-screen">
          <div
              onClick={() => {
                  setIsOpen(false);
              }}
              class={`fixed w-full h-full bg-black opacity-10 ${isOpen() ? 'block' : 'hidden'}`}
          ></div>
          {children(() => props.children)()}
        </div>
      </div>
  );
}
