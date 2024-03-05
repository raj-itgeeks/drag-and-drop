import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { data } from "./data";
import { ReactComponent as Drag } from "./drag.svg";

import "./App.css";

function App() {
  const [enterEle, updateEnterEle] = useState({
    id: "",
    name: "",
    index: "",
  });
  const [enterOne, updateEnterOne] = useState({
    id: "",
    name: "",
    index: "",
  });

  const [enterNested, updateEnterNested] = useState({
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

  // this is the initialization of tree
  // const tree = new Tree();
  // const node = new Node("level-one");
  // tree.root = node;

  // node.children.push(data);
  // console.log(tree);
  // // loop to create tree
  // // for (let i = 0; i < data.length; i++) {

  // //   if (data[i].children.length > 0) {

  // //   }else{

  // //   }
  // // }

  // reorder function
  function reorder(sourceIdx, destinationIdx) {
    const newItems = Array.from(dat);
    // newItems.splice

    const [removed] = newItems.splice(Number(sourceIdx), 1);
    // console.log(removed, "this is removed", sourceIdx, destinationIdx);
    newItems.splice(Number(destinationIdx), 0, removed);

    updateEnterEle({
      id: "",
      index: "",
    });
    updateEnterOne({
      id: "",
      index: "",
    });
    updateEnterNested({
      id: "",
      index: "",
    });
    return newItems;
  }

  //Add method to add element
  function add(sourceIdx, destinationIdx, sourceId) {
    const newItems = Array.from(dat);
    const removed = [];

    newItems.map((ele, index) => {
      if (ele.id === sourceId) {
        const Items = reorder(sourceIdx, destinationIdx);

        updateDat(Items);
        return;
      } else {
        ele.subMenu?.map((e, i) => {
          if (e.id === sourceId) {
            const eke = newItems[index].subMenu?.splice(i, 1);

            removed.push(eke[0]);
          } else {
            e.nestedSubMenu?.map((ne, idx) => {
              if (ne.id === sourceId) {
                const ele = newItems[index].subMenu[i].nestedSubMenu?.splice(
                  idx,
                  1
                );
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
      newItems.splice(Number(destinationIdx), 0, removed[0]);
      updateDat(newItems);
    }
   

    updateEnterEle({
      id: "",
      index: "",
    });
    updateEnterOne({
      id: "",
      index: "",
    });
    updateEnterNested({
      id: "",
      index: "",
    });
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
    if (enterOne.name == "level-one") {
      add(index, enterOne.index, idx);
    }
    if (enterEle.name == "level-two") {
      //1 append in anyone
    }

  }

  // get the element on which our dragging element is present

  function getElement(id) {
    const ele = document.getElementById(id);
    console.log(ele.offsetTop, ele.offsetLeft);
  }

  //

  return (
    <div className="App">
      <Header />
      <div>{enterEle?.id}</div>
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
                  option?.id === enterEle?.id
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

                  updateEnterEle({
                    id: option?.id,
                    name: "menu",
                    index: `${index}`,
                  });
                }}
                onDragExitCapture={(e) => {
                  e.preventDefault();
                  updateEnterEle({
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
                option?.subMenu.length > 0 && (
                  <div
                    style={{
                      paddingLeft: "20px",
                    }}
                  >
                    {option.subMenu.map((child, index) => {
                      return (
                        <div
                          style={
                            child.id === enterNested?.id
                              ? {
                                  borderBottom: "4px solid blue",
                                }
                              : {
                                  display: "block",
                                }
                          }
                          key={index}
                        >
                          <div
                            style={{
                              border: "1px solid black",
                              margin: "10px",
                            }}
                            id={child.id}
                            index={index}
                            draggable={true}
                            onDragStart={(e) => {
                              // e.preventDefault();
                              e.dataTransfer.setData(
                                "text",
                                e.currentTarget.id
                              );
                              e.dataTransfer.setData("index", index);
                            }}
                            onDragEnter={(e) => {
                              e.preventDefault();
                              updateEnterNested({
                                id: child.id,
                                name: "level-submenu",
                                index: `${index}`,
                              });
                            }}
                            onDragExit={(e) => {
                              e.preventDefault();
                              updateEnterNested({
                                id: "",
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
                            child.nestedSubMenu.length > 0 && (
                              <div>
                                {child.nestedSubMenu.map((subele, index) => {
                                  return (
                                    <div
                                      key={index}
                                      style={
                                        subele.id == enterNested.id
                                          ? {
                                              borderBottom: "4px solid blue",
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
                                        e.dataTransfer.setData("index", index);
                                      }}
                                      onDragEnter={(e) => {
                                        e.preventDefault();
                                        updateEnterNested({
                                          id: `${subele.id}`,
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
                      );
                    })}
                  </div>
                )}
              <div
                style={
                  `${index}` === enterOne.index
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
                  updateEnterOne({
                    id: option.id,
                    name: "level-one",
                    index: `${index}`,
                  });
                  updateEnterEle({
                    id:"",
                    name:"",
                    index:""
                  })
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  updateEnterOne({
                    id: "",
                    name:"",
                    index: "",
                  });
                }}
              ></div>
            </div>
          );
        })}

        <div></div>
      </div>
    </div>
  );
}
export default App;
