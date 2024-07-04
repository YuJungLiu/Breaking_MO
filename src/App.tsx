import React, { useState, useEffect, Fragment } from "react";
import Column from "./components/Column";
import { initialColumns } from "./components/Col";
import { DragDropContext, DropResult, DragStart } from "react-beautiful-dnd";
import styled from "styled-components";
import Data from "./components/data";
import Move from "./components/Move";
import ColumnProps from "./components/IColumn";
import MoveSet from "./components/IMoveSet";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import { Dialog, Transition } from "@headlessui/react";

const css = `
.react-tabs__tab-list { z-index: 10; display: flex; background-color: white; border-bottom: 1px solid #aaa; margin: 1rem 0rem; padding: 0; position:sticky; top:0; overflow: none;} 
.react-tabs__tab { display: inline-block;
border: 1px solid transparent; border-bottom: none; bottom: -1px; position: relative; list-style: none; padding: 6px 12px;
cursor: pointer; color: gray;} 
.react-tabs__tab--selected { background: #fff; 
  // border-color: #aaa; 
  color: black; 
  border-radius: 5px 5px 0 0; 
box-shadow: 0 0 5px hsl(208, 99%, 50%); 
border-color: hsl(208,
  99%, 50%);} 
.react-tabs__tab-panel { display: none; } 
.react-tabs__tab-panel--selected { 
  display: grid;
  overflow-y: clip;
} 
.react-tabs__tab--disabled{ color: gray; cursor: default; } 
.react-tabs__tab:focus { box-shadow: 0 0 5px hsl(208, 99%, 50%); border-color: hsl(208,
99%, 50%); outline: none;} 
// .react-tabs__tab:focus:after { content: ""; position: absolute; height: 5px; left: -4px; right:
// -4px; bottom: -5px;}
`;

const StyleBody = styled.div<{ $expand: boolean }>`
  display: grid;
  grid-template-columns: ${(props) => (props.$expand ? "1fr" : "1fr 2fr")};
  overflow-y: clip;
`;
const StyledLeftPlane = styled.div`
  width: 100%;
  height: 100vh;
  background-color: whitesmoke;
  position: sticky;
  top: 0;
  overflow-y: clip;
`;
const StyledPlane = styled.div<{ $expand: boolean }>`
  margin: auto;
  width: 92.5%;
  height: 100vh;
  gap: 8px;
  overflow-y: clip;
  display: ${(props) => (props.$expand ? "none" : "block")};
`;

const StyledControl = styled.div<{ $expand: boolean }>`
  display: grid;
  grid-template-columns: ${(props) => (props.$expand ? "1fr 1fr 1fr" : "1fr")};
  width: auto;
  height: 77.25vh;
  gap: 4px;
  margin: .5rem .25vh 2.5vh;
  padding-bottom: 2.5vh;
  overflow-y: scroll;
  border-bottom: 2px solid #bbb;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: auto;
  height: 5vh;
  gap: 8px;
  justify-content: center;
  margin: 0 1rem;
`;
const SingleButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  width: auto;
  height: 5vh;
  margin: 0 2.5vh;
  gap: 8px;
  justify-content: center;
`;

const Button = styled.div<{ $reset: boolean }>`
  background-image: ${(props) =>
    !props.$reset
      ? `linear-gradient(
    to right,
    #485563 0%,
    #29323c 51%,
    #485563 100%
  );`
      : `
  linear-gradient(to right top, #e80c89, #e2248d, #dc3290, #d53c93, #cf4596, #d1448b, #d14581, #d14677, #d2475e, #cc4d46, #c2562f, #b36017);`}
  margin: .5rem;
  text-align: center;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: block;
  line-height: 5vh;
  cursor: pointer;
`;

const StyledColumns = styled.div<{ $expand: boolean }>`
  display: grid;
  grid-template-columns: ${(props) => (props.$expand ? "3fr" : "1fr")};
  width: 100%;
  max-height: 85vh;
  gap: 4px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

for (let i = 0; i < Data.control.length; i++) {
  initialColumns.control[i].list = Data.control[i].list.map((v: any) => ({
    name: v[0],
    id: initialColumns.control[i].id,
    usedCount: 0,
    hard: v[1]
  }));
}

for (let i = 0; i < Data.data.length; i++) {
  initialColumns.data[i].list = Data.data[i].list.map((v: any) => ({
    name: v[0],
    id: initialColumns.data[i].id,
    usedCount: 0,
    hard: v[1]
  }));
}

function App() {
  let allInformation;
  const data = localStorage.getItem("data");
  if (data != null) allInformation = JSON.parse(data);
  else allInformation = JSON.parse(JSON.stringify(initialColumns));
  const [columns, setColumns] = useState(allInformation);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpand, setIsExpand] = useState(false);

  const handleClick = () => {
    localStorage.removeItem("data");
    setColumns(JSON.parse(JSON.stringify(initialColumns)));
    setIsOpen(false);
  };

  const handleEnsureSelect = (col: string) => {
    let index: number = +col;
    let selectedMoves: Move[] = columns.control[index].list;
    selectedMoves.forEach((element) => {
      element.usedCount++;
    });
    setColumns((state: ColumnProps) => {
      let temp = JSON.parse(JSON.stringify(state));
      selectedMoves.forEach((move) => {
        for (let i = 0; i < temp.data.length; i++) {
          if (temp.data[i].id === move.id) {
            temp.data[i].list.push({ ...move });
            break;
          }
        }
      });
      for (let i = 0; i < temp.data.length; i++) {
        temp.data[i].list.sort((a: Move, b: Move) => a.usedCount - b.usedCount);
      }
      temp.control[index].list = [];
      return { control: [...temp.control], data: [...temp.data] };
    });
  };

  const handleUndoSelect = (col: string) => {
    let index: number = +col;
    let selectedMoves: Move[] = columns.control[index].list;
    setColumns((state: ColumnProps) => {
      let temp = JSON.parse(JSON.stringify(state));
      selectedMoves.forEach((move) => {
        for (let i = 0; i < temp.data.length; i++) {
          if (temp.data[i].id === move.id) {
            temp.data[i].list.push({ ...move });
            break;
          }
        }
      });
      for (let i = 0; i < temp.data.length; i++) {
        temp.data[i].list.sort((a: Move, b: Move) => a.usedCount - b.usedCount);
      }
      temp.control[col].list = [];
      return { control: [...temp.control], data: [...temp.data] };
    });
  };

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(columns));
  }, [columns]);

  const onDragStart = ({ type, source }: DragStart) => {
    setColumns((state: ColumnProps) => {
      for (let i = 0; i < state.data.length; i++) {
        if (state.data[i].index !== source.droppableId)
          state.data[i].droppable = false;
      }
      return { control: [...state.control], data: [...state.data] };
    });
  };
  const onDragEnd = ({ source, destination }: DropResult) => {
    // Make sure we have a valid destination
    setColumns((state: ColumnProps) => {
      state.data.forEach((col) => (col.droppable = true));
      state.control.forEach((col) => (col.droppable = true));
      return { control: [...state.control], data: [...state.data] };
    });
    let startIndex: number = +source.droppableId;
    const start =
      startIndex < 3
        ? columns.control[startIndex]
        : columns.data[startIndex - 3];

    if (destination === undefined || destination === null) {
      if (startIndex < 3) {
        const newList = start.list.filter(
          (_: any, idx: number) => idx !== source.index
        );
        const newStartCol = { ...start, list: newList };

        const item = start.list[source.index];
        let end;
        for (let i = 0; i < columns.data.length; i++) {
          if (columns.data[i].id === item.id) {
            console.log(columns.data[i].id, item.id);
            end = columns.data[i];
            break;
          }
        }
        const newEndList = [...end.list, start.list[source.index]];
        const newEndCol = {
          ...end,
          list: newEndList,
        };

        setColumns((state: ColumnProps) => {
          for (let i = 0; i < state.data.length; i++) {
            if (state.data[i].index == newStartCol.index)
              state.data[i] = newStartCol;
            else if (state.data[i].id == start.list[source.index].id)
              state.data[i] = newEndCol;
          }

          for (let i = 0; i < state.control.length; i++) {
            if (state.control[i].index == newStartCol.index)
              state.control[i] = newStartCol;
            else if (state.control[i].id == start.list[source.index].id)
              state.control[i] = newEndCol;
          }
          for (let i = 0; i < state.data.length; i++) {
            state.data[i].list.sort((a, b) => a.usedCount - b.usedCount);
          }
          return { control: [...state.control], data: [...state.data] };
        });
      }

      return null;
    }

    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;

    // Set start and end variables
    let endIndex: number = +destination.droppableId;
    const end =
      endIndex < 3 ? columns.control[endIndex] : columns.data[endIndex - 3];

    // If start is the same as end, we're in the same column
    if (source.droppableId === destination.droppableId) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start.list.filter(
        (_: any, idx: number) => idx !== source.index
      );

      // Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index]);
      console.log(newList);
      // Then create a new copy of the column object
      const newCol = {
        ...start,
        list: newList,
      };

      // Update the state
      setColumns((state: ColumnProps) => {
        for (let i = 0; i < state.data.length; i++) {
          if (state.data[i].index == newCol.index) state.data[i] = newCol;
        }
        for (let i = 0; i < state.control.length; i++) {
          if (state.control[i].index == newCol.index) state.control[i] = newCol;
        }
        for (let i = 0; i < state.data.length; i++) {
          state.data[i].list.sort((a, b) => a.usedCount - b.usedCount);
        }
        return { control: [...state.control], data: [...state.data] };
      });

      return null;
    } else {
      if (startIndex < 3 && end.index >= 3) {
        const newList = start.list.filter(
          (_: any, idx: number) => idx !== source.index
        );
        const newStartCol = { ...start, list: newList };

        const item = start.list[source.index];
        let end;
        for (let i = 0; i < columns.data.length; i++) {
          if (columns.data[i].id === item.id) {
            console.log(columns.data[i].id, item.id);
            end = columns.data[i];
            break;
          }
        }
        const newEndList = [...end.list, start.list[source.index]];
        const newEndCol = {
          ...end,
          list: newEndList,
        };

        setColumns((state: ColumnProps) => {
          for (let i = 0; i < state.data.length; i++) {
            if (state.data[i].index == newStartCol.index)
              state.data[i] = newStartCol;
            else if (state.data[i].index == newEndCol.index)
              state.data[i] = newEndCol;
          }
          for (let i = 0; i < state.control.length; i++) {
            if (state.control[i].index == newStartCol.index)
              state.control[i] = newStartCol;
            else if (state.control[i].index == newEndCol.index)
              state.control[i] = newEndCol;
          }
          for (let i = 0; i < state.data.length; i++) {
            state.data[i].list.sort((a, b) => a.usedCount - b.usedCount);
          }
          return { control: [...state.control], data: [...state.data] };
        });

        return null;
      }

      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      const newStartList = start.list.filter(
        (_: any, idx: number) => idx !== source.index
      );

      // Create a new start column
      const newStartCol = {
        ...start,
        list: newStartList,
      };

      // Make a new end list array

      const newEndList = end.list;

      // Insert the item into the end list
      newEndList.splice(destination.index, 0, start.list[source.index]);

      // Create a new end column
      const newEndCol = {
        ...end,
        list: newEndList,
      };

      // Update the state
      setColumns((state: ColumnProps) => {
        for (let i = 0; i < state.data.length; i++) {
          if (state.data[i].index == newStartCol.index)
            state.data[i] = newStartCol;
          else if (state.data[i].index == newEndCol.index)
            state.data[i] = newEndCol;
        }
        for (let i = 0; i < state.control.length; i++) {
          if (state.control[i].index == newStartCol.index)
            state.control[i] = newStartCol;
          else if (state.control[i].index == newEndCol.index)
            state.control[i] = newEndCol;
        }
        for (let i = 0; i < state.data.length; i++) {
          state.data[i].list.sort((a, b) => a.usedCount - b.usedCount);
        }
        return { control: [...state.control], data: [...state.data] };
      });
      return null;
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <style>{css}</style>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <StyleBody $expand={isExpand}>
          <StyledLeftPlane>
            <Button $reset={false} onClick={() => setIsExpand(!isExpand)}>
              {isExpand ? `收合` : `展開`}
            </Button>

            <StyledControl $expand={isExpand}>
              {columns.control.map((col: MoveSet) => {
                return (
                  <div key={col.index}>
                    <Column col={col} key={col.index} />
                    <ButtonContainer key={col.index}>
                      <Button
                        key={col.index}
                        $reset={false}
                        onClick={() => handleUndoSelect(col.index)}
                      >
                        還原
                      </Button>
                      <Button
                        key={col.index}
                        $reset={false}
                        onClick={() => handleEnsureSelect(col.index)}
                      >
                        回收組合
                      </Button>
                    </ButtonContainer>
                  </div>
                );
              })}
            </StyledControl>
            <SingleButtonContainer>
              <Button $reset={true} onClick={openModal}>
                重設
              </Button>
            </SingleButtonContainer>
          </StyledLeftPlane>
          <StyledPlane $expand={isExpand}>
            <Tabs>
              <TabList>
                {columns.data
                  .filter((col: MoveSet) => col.index !== "0")
                  .map((col: MoveSet) => (
                    <Tab key={col.index}>{col.id}</Tab>
                  ))}
              </TabList>

              <StyledColumns $expand={isExpand}>
                {columns.data
                  .filter((col: MoveSet) => col.index !== "0")
                  .map((col: MoveSet) => (
                    <TabPanel key={col.index}>
                      <Column col={col} key={col.index} />
                    </TabPanel>
                  ))}
              </StyledColumns>
            </Tabs>
          </StyledPlane>
        </StyleBody>
      </DragDropContext>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    請注意！
                  </Dialog.Title>
                  <div className="mt-2 ">
                    <p className="text-sm text-gray-500">
                      還原狀態會將所有使用次數及目前招式編排還原。
                    </p>
                  </div>
                  <div className="mt-4 h-full flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent mr-4 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => closeModal()}
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => handleClick()}
                    >
                      確定還原
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default App;
