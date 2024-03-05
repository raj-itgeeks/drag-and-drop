import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React, { useEffect, useState } from "react";

import { data } from "./data";
import { ReactComponent as Drag } from "./drag.svg";

import "./App.css";

function App() {
  //here I am handling states of levels
  const [enterOne, updateEnterOne] = useState({
    // this is the level which is in the top level middile line
    id: "",
    name: "",
    index: "",
  });
  const [enterTwo, updateEnterTwo] = useState({
    // this is the level that which indicate grand parants
    id: "",
    name: "",
    index: "",
  });

  const [enterNested, updateEnterNested] = useState({
    // this is for the lower div of first nested
    id: "",
    name: "",
    index: "",
  });
  const [enterFour, updateEnterFour] = useState({
    // this is for the first nested parents
    id: "",
    name: "",
    index: "",
  });
  const [enterFive, updateEnterFive] = useState({
    // this is for the child nested
    id: "",
    name: "",
    index: "",
  });

  const [dat, updateDat] = useState(data);
  const [show, updateShow] = useState({
    bool: false,
    id: "",
  });
  const [showChild, updateShowChil] = useState({
    bool: false,
    id: "",
  });

  // function to reorder our states
  function refresh() {
    updateEnterOne({
      id: "",
      name: "",
      index: "",
    });
    updateEnterTwo({
      id: "",
      name: "",
      index: "",
    });
    updateEnterNested({
      id: "",
      name: "",
      index: "",
    });
    updateEnterFour({
      id: "",
      name: "",
      index: "",
    });
    updateEnterFive({
      id: "",
      name: "",
      index: "",
    });
  }

  // reorder function
  function reorder(sourceIdx, destinationIdx, data) {
    const newItems = Array.from(data);
    const [removed] = newItems.splice(Number(sourceIdx), 1);
    newItems.splice(Number(destinationIdx), 0, removed);
    refresh();
    return newItems;
  }

  //Add method to add element
  function add(sourceIdx, destinationIdx, sourceId, data) {
    const newItems = Array.from(data);
    const removed = [];

    newItems.map((ele, index) => {
      if (ele.id === sourceId) {
        const Items = reorder(sourceIdx, destinationIdx, newItems);
        updateDat(Items);
        return;
      } else {
        ele.child?.map((e, i) => {
          if (e.id === sourceId) {
            const eke = newItems[index].child?.splice(i, 1);

            removed.push(eke[0]);
          } else {
            e.child?.map((ne, idx) => {
              if (ne.id === sourceId) {
                const ele = newItems[index].child[i].child?.splice(idx, 1);
                console.log(ele);
                removed.push(ele[0]);
              }
            });
          }
        });
      }
    });

    if ((removed[0] != undefined) | null) {
      console.log("true hai", removed[0]);
      newItems.splice(Number(destinationIdx) + 1, 0, removed[0]);
      updateDat(newItems);
    }
    refresh();
  }

  // this is a function to add a child to menu
  function addChild(sourceId, sourceIndex, ele) {
    const newItems = Array.from(dat);
    newItems.map((element, index) => {
      if (element.id === sourceId) {
        const [removed] = newItems.splice(Number(sourceIndex), 1);
        newItems[Number(ele.index) - 1].child.push(removed);
        console.log(newItems);

        updateDat(newItems);
        return;
      } else {
        element.child?.map((subMenu, idx) => {
          if (subMenu.id === sourceId) {
            const [removed] = newItems[index].child.splice(
              Number(sourceIndex),
              1
            );
            newItems[Number(ele.index)].child.push(removed);
            updateDat(newItems);
            return;
          } else {
            subMenu.child.map((nestedMenu) => {
              if (nestedMenu.id === sourceId) {
                const [removed] = newItems[index].child[idx].child.slice(
                  Number(sourceIndex),
                  1
                );
                newItems[Number(ele.index)].child.push(removed);
                updateDat(newItems);
                return;
              }
            });
          }
          refresh();
        });
      }
    });
  }

  // function for sub menu operationss
  function submenuOperation(sourceId, sourceIndex, ele) {
    const newItems = Array.from(dat);

    const isGrand = newItems.some((ele) => {
      if (ele.id === sourceId) {
        return true;
      } else {
        return false;
      }
    });
    if (isGrand) {
      const [removed] = newItems.splice(Number(sourceIndex), 1);
      newItems.forEach((objone, indexone) => {
        if (objone.child) {
          objone.child.forEach((objtwo, indextwo) => {
            console.log(objtwo.id, ele.id);
            if (objtwo.id === ele.id) {
             
              newItems[indexone].child?.splice(
                Number(ele.index + 1),
                0,
                removed
              );
              updateDat(newItems);
            }
          });
        }
      });

      refresh();
    }else {
      newItems.forEach((obj,indexone)=>{
        obj.child?.forEach((objOne, indextwo) => {
          if (objOne.id === sourceId) {
            const items = reorder(
              sourceIndex,
              ele.index,
              newItems[indexone].child
            );
            newItems[indexone].child = [...items];
            console.log(newItems);
          } else {
            objOne.child?.forEach((objTwo, indexthree) => {
              if (objTwo.id === sourceId) {
                const [removed] = newItems[indexone].child[
                  indextwo
                ].child.splice(Number(sourceIndex), 1);
                newItems[indexone].child.splice(Number(ele.index)+1, 0, removed);
              }
            });
          }
        });
      })
    }
    
  }

  // this is a swap function to
  function swap(index, idx) {
    const newItems = Array.from(data);
    const [removed] = newItems.splice(Number(index), 1);
    newItems[idx - 1].children.push(removed);
    // console.log(newItems);
    updateDat(newItems);
  }
  //handle Drage Capture
  function handleDragCapture(index, idx) {
    if (enterTwo.name == "level-one") {
      add(index, enterTwo.index, idx, dat);
    }
    if (enterOne.name == "level-two") {
      //1 append child
      addChild(idx, index, enterOne);
    }
    if (enterNested.name == "level-three") {
      //1 reorder
      //2 append to sibling
      submenuOperation(idx, index, enterNested);
    }
    if (enterFour.name == "level-four") {
      console.log("hum level four me hain", idx, index, enterFour);
    }
  }

  return (
    <div className="App">
      {/* <Header /> */}
      {/* <div>{enterOne?.id}</div> */}
      <div
        style={{
          padding: "40px",
          display: "flex",
          gap: "25px",
          flexDirection: "column",
          border: "2px solid black",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          // console.log(e.currentTarget.id)
        }}
        onDrop={(e) => {
          let index = e.dataTransfer.getData("index");
          let idx = e.dataTransfer.getData("text");
          // console.log(index, idx);
          handleDragCapture(index, idx);
        }}
      >
        {dat.map((option, index) => {
          return (
            <div key={index} id={option?.id}>
              <div
                style={
                  option?.id === enterOne?.id
                    ? {
                        borderBottom: "4px solid blue",
                        marginLeft: "8px",
                        padding: "5px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        background: "lightgrey",
                      }
                    : {
                        display: "block",
                        marginLeft: "8px",
                        padding: "5px",
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                        background: "lightgrey",
                        border: "1px solid black",
                      }
                }
                id={option?.id}
                index={index}
                draggable="true"
                onDragStart={(e) => {
                  // e.preventDefault();
                  e.dataTransfer.setData("text", e.currentTarget.id);
                  e.dataTransfer.setData("index", index);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();

                  updateEnterOne({
                    id: option?.id,
                    name: "level-two",
                    index: `${index}`,
                  });
                }}
                onDragExitCapture={(e) => {
                  e.preventDefault();
                  updateEnterOne({
                    id: "",
                    index: "",
                  });
                }}
              >
                <Drag></Drag>
                <span> </span>
                {option?.name}
                <button
                  onClick={() => {
                    updateShow({ bool: !show.bool, id: option?.id });
                  }}
                >
                  Open
                </button>
              </div>

              {show.bool &&
                show.id === option?.id &&
                option?.child.length > 0 && (
                  <div
                    style={{
                      paddingLeft: "20px",
                    }}
                  >
                    {option.child.map((child, index) => {
                      return (
                        <div
                          key={index}
                          style={{
                            padding: "10px",
                          }}
                        >
                          <div
                            style={{
                              paddingLeft: "20px",
                            }}
                          >
                            <div
                              style={
                                child.id === enterFour?.id
                                  ? {
                                      display: "block",
                                      borderTop: "1px solid black",
                                      borderRight: "1px solid black",
                                      borderLeft: "1px solid black",
                                      borderBottom: "4px solid blue",
                                    }
                                  : {
                                      border: "1px solid black",
                                      display: "block",
                                    }
                              }
                              id={child.id}
                              index={index}
                              draggable={true}
                              onDragStart={(e) => {
                                // e.preventDefault();
                                e.dataTransfer.setData("text", child.id);
                                e.dataTransfer.setData("index", index);
                              }}
                              onDragEnter={(e) => {
                                e.preventDefault();
                                updateEnterFour({
                                  id: child.id,
                                  name: "level-four",
                                  index: `${index}`,
                                });
                              }}
                              onDragExit={(e) => {
                                e.preventDefault();
                                updateEnterFour({
                                  id: "",
                                  name: "",
                                  index: "",
                                });
                                updateEnterNested({
                                  id: "",
                                  name: "",
                                  index: "",
                                });
                              }}
                            >
                              <div
                                style={{
                                  padding: "5px",
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                <Drag></Drag>
                                {child.name}
                                <button
                                  onClick={() => {
                                    updateShowChil({
                                      bool: !showChild.bool,
                                      id: child.id,
                                    });
                                  }}
                                >
                                  Open
                                </button>
                              </div>
                            </div>

                            {showChild.bool &&
                              child.id === showChild.id &&
                              child.child.length > 0 && (
                                <div>
                                  {child.child.map((subele, index) => {
                                    return (
                                      <div
                                        key={index}
                                        style={
                                          subele.id == enterNested.id
                                            ? {
                                                border: "1px solid black",
                                                margin: "3px",
                                                padding: "5px",
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "40px",
                                                gap: "5px",
                                              }
                                            : {
                                                border: "1px solid black",
                                                margin: "3px",
                                                padding: "5px",
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "40px",
                                                gap: "5px",
                                              }
                                        }
                                        draggable={true}
                                        onDragStart={(e) => {
                                          // e.preventDefault();
                                          e.dataTransfer.setData(
                                            "text",
                                            e.currentTarget.id
                                          );
                                          e.dataTransfer.setData(
                                            "index",
                                            index
                                          );
                                        }}
                                        onDragEnter={(e) => {
                                          e.preventDefault();
                                          updateEnterNested({
                                            id: `${subele.id}`,
                                            name: "level-three",
                                            index: `${index}`,
                                          });
                                        }}
                                      >
                                        <Drag strokeWidth={1}></Drag>

                                        {subele.name}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                          </div>

                          <div
                            style={
                              `${index}` === enterNested.index
                                ? {
                                    height: "20px",
                                    width: "100%",
                                    borderBottom: "4px solid blue",
                                  }
                                : {
                                    // display:"none",
                                    height: "10px",
                                    width: "100%",
                                  }
                            }
                            onDragEnter={(e) => {
                              e.preventDefault();
                              // let idx = e.dataTransfer.getData("text");
                              updateEnterNested({
                                id: child.id,
                                name: "level-three",
                                index: `${index}`,
                              });
                              updateEnterOne({
                                id: "",
                                name: "",
                                index: "",
                              });
                              updateEnterTwo({
                                id: "",
                                name: "",
                                index: "",
                              });
                              updateEnterFour({
                                id: "",
                                name: "",
                                index: "",
                              });
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              updateEnterNested({
                                id: "",
                                name: "",
                                index: "",
                              });
                            }}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                )}
              <div
                style={
                  `${index}` === enterTwo.index
                    ? {
                        height: "20px",
                        width: "100%",
                        borderBottom: "4px solid blue",
                      }
                    : {
                        height: "20px",
                        width: "100%",
                      }
                }
                onDragEnter={(e) => {
                  e.preventDefault();
                  // let idx = e.dataTransfer.getData("text");
                  updateEnterTwo({
                    id: option.id,
                    name: "level-one",
                    index: `${index}`,
                  });
                  updateEnterOne({
                    id: "",
                    name: "",
                    index: "",
                  });
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  updateEnterTwo({
                    id: "",
                    name: "",
                    index: "",
                  });
                }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default App;
