import { useLocation, useNavigate } from "@solidjs/router";
import {
  JSX,
  createEffect,
  createSignal,
  For,
  children,
  Component,
  onMount,
  onCleanup,
  Index,
} from "solid-js";
import MenuItem from "./MenuItem";
import { Header } from "../container/Header";
import { useAdmin } from "../context/AdminContext";

type MenuItemType = {
  icon: Component;
  label: string;
  to: string;
  path: string[];
};

type SideMenuProps = {
  children: JSX.Element;
  className?: string;
  menus?: MenuItemType[];
  menuSelected: number;
  OnMenuSelected: (menu: number) => void;
};

export default function SideMenu(props: SideMenuProps) {
  const [_, setAdmin] = useAdmin();
  const navigation = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = createSignal<boolean>(false);
  const [activeStyle, setActiveStyle] = createSignal<{
    top: number;
    height: number;
  }>({ top: 0, height: 0 });

  const menuRefMap: Record<number, HTMLDivElement | undefined> = {};

  const checkScreen = () => {
    if (window.innerWidth > 768) {
      setIsOpen(false);
    }
  };

  onMount(() => {
    window.addEventListener("resize", checkScreen);
  });

  createEffect(() => {
    const path = location.pathname;
    const activeIndex =
      props.menus?.findIndex((menu) => {
        return menu.path.some((pattern) => {
          try {
            const regex = RegExp(pattern);
            return regex.test(path);
          } catch (e) {
            return false;
          }
        });
      }) ?? -1;

    if (activeIndex >= 0) {
      const menuElement = menuRefMap[activeIndex];
      const size = props.menus?.length ?? 0;
      if (menuElement) {
        setActiveStyle({
          top: menuElement.offsetTop - size / 2,
          height: menuElement.offsetHeight + size,
        });
      }

      if (props.menus) {
        setAdmin({
          selectedLabel: props.menus[activeIndex ?? 0].label,
        });
      }
    }

    window.scrollTo(0, 0);
  });

  onCleanup(() => window.removeEventListener("resize", checkScreen));

  return (
    <div class={`w-full h-screen ${props.className}`}>
      <Header
        onToggle={(toggle) => {
          setIsOpen(toggle);
        }}
        toggle={isOpen}
      ></Header>
      <div
        class={`fixed transform transition-transform duration-200 ease-in-out z-40 flex pt-3.5 w-[80vw] md:w-sidebar h-screen bg-white overflow-auto md:translate-x-0 -translate-x-full ${isOpen() ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div class="relative w-full">
          <div class="flex flex-col pt-5">
            <Index each={props.menus}>
              {(menu, index) => {
                const { label, icon, to, path } = menu();
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
                  <div ref={(el) => (menuRefMap[index] = el)}>
                    <MenuItem
                      label={label}
                      Icon={icon}
                      selected={isSelected}
                      onClick={async () => {
                        navigation(to);
                        props.OnMenuSelected(index);
                        setIsOpen(false);
                        setAdmin({
                          selectedLabel: label,
                        });
                      }}
                    />
                  </div>
                );
              }}
            </Index>
            <div class="h-[100px]"></div>
          </div>
          <div
            class="absolute left-0 w-2 h-2 bg-black rounded-tr-lg rounded-br-lg transition-all duration-300"
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
          class={`fixed w-full h-full bg-black opacity-10 ${isOpen() ? "block" : "hidden"}`}
        ></div>
        {children(() => props.children)()}
      </div>
    </div>
  );
}
