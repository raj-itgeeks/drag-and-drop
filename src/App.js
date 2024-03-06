import React, { useEffect, useState } from "react";
import { data } from "./data";
import { ReactComponent as Drag } from "./drag.svg";
import "./App.css";

// lets create a tree data structure

// we create a class for each node in our treee
class Node {
  // each node has three properties, its value, a pointer
  constructor(key, value = key, parent = null, path) {
    this.key = key;
    this.path = path;
    this.value = value;
    this.parent = parent;
    this.descendants = [];
  }
  get isLeaf() {
    return this.descendants.length === 0;
  }

  get hasChild() {
    return !this.isLeaf;
  }
}

// we create a class for our tree
class Tree {
  constructor(key, value = key, path) {
    this.root = new Node(key, value, path);
  }

  // this is the method to pre order travers in a tree
  *preOrderTraversal(node = this.root) {
    yield node;
    if (node.descendants.length) {
      for (let child of node.descendants) {
        yield* this.preOrderTraversal(child);
      }
    }
  }

  // this is the method to post order travers
  *postOrderTraversal(node = this.root) {
    if (node.descendants.length) {
      for (let child of node.descendants) {
        yield* this.postOrderTraversal(child);
      }
    }
    yield node;
  }

  // this is the insert method to insert child
  insert(parentNodeKeyey, key, value = key, path) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === parentNodeKeyey) {
        node.descendants.push(new Node(key, value, node, path));
        return true;
      }
    }
    return false;
  }

  // insert at preticuler destination
  insertDest(parentNodeKeyey, destinationIdx, obj) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === parentNodeKeyey) {
        node.descendants.splice(Number(destinationIdx), 0, obj);
        return true;
      }
    }
    return false;
  }

  //  this is the remove method to remove a child
  remove(key) {
    for (let node of this.postOrderTraversal()) {
      const filtered = node.descendants.filter((c) => c.key !== key);
      if (filtered.length !== node.descendants.length) {
        node.descendants = filtered;
        return true;
      }
    }
    return false;
  }

  // this is the find method to find node
  find(key) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === key) return node;
    }
    return undefined;
  }

  //this is the reorder method
  reorder(sourceIdx, destinationIdx, key) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === key) {
        const [removed] = node.descendants.splice(Number(sourceIdx), 1);
        node.descendants.splice(Number(destinationIdx), 0, removed);
        return true;
      }
    }
    return false;
  }
}

function App() {
  //  here i am testing my tree data structer
  const tree = new Tree(1, "tree", "path");

  data.forEach((e) => {
    tree.insert(1, e.id, e.name, e.Path);
    if (e.child) {
      e.child.forEach((f) => {
        tree.insert(e.id, f.id, f.name, f.Path);
        if (f.child) {
          f.child.forEach((g) => {
            tree.insert(f.id, g.id, g.name, g.Path);
          });
        }
      });
    }
  });
  const [treee, updateTreee] = useState(tree);
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

  const [enterThree, updateEnterThree] = useState({
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
    updateEnterThree({
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
  function add(sourceIdx, destinationIdx, sourceId, destinationID) {
    const isSource = tree.find(sourceId);
    const isDestinaton = tree.find(destinationID);

    if (isSource.parent.key === isDestinaton.parent.key) {
      tree.reorder(sourceIdx, destinationIdx, isDestinaton.parent.key);
    } else {
      tree.remove(isSource.key);
      tree.insertDest(isDestinaton.parent.key, destinationIdx, isSource);
    }
    updateTreee(tree);
    refresh();
  }

  // this is a function to add a child to menu
  function addChild(sourceId, ele) {
    const isSource = tree.find(sourceId);
    const isDestinaton = tree.find(ele.id);
    tree.remove(isSource.key);
    tree.insertDest(isDestinaton.key, ele.index,isSource);
    updateTreee(tree);
    refresh();
  }

  // function for sub menu operationss
  // function submenuOperation(sourceId, sourceIndex, ele) {
  //   const isSource=tree.find(sourceId);
  //   const isDestinaton=tree.find(ele.id);

  //   const isGrand = newItems.some((ele) => {
  //     if (ele.id === sourceId) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  //   if (isGrand) {
  //     const [removed] = newItems.splice(Number(sourceIndex), 1);
  //     newItems.forEach((objone, indexone) => {
  //       if (objone.child) {
  //         objone.child.forEach((objtwo, indextwo) => {
  //           console.log(objtwo.id, ele.id);
  //           if (objtwo.id === ele.id) {
  //             newItems[indexone].child?.splice(
  //               Number(ele.index + 1),
  //               0,
  //               removed
  //             );
  //             updateDat(newItems);
  //           }
  //         });
  //       }
  //     });

  //     refresh();
  //   } else {
  //     newItems.forEach((obj, indexone) => {
  //       obj.child?.forEach((objOne, indextwo) => {
  //         if (objOne.id === sourceId) {
  //           const items = reorder(
  //             sourceIndex,
  //             ele.index,
  //             newItems[indexone].child
  //           );
  //           newItems[indexone].child = [...items];
  //           console.log(newItems);
  //         } else {
  //           objOne.child?.forEach((objTwo, indexthree) => {
  //             if (objTwo.id === sourceId) {
  //               const [removed] = newItems[indexone].child[
  //                 indextwo
  //               ].child.splice(Number(sourceIndex), 1);
  //               newItems[indexone].child.splice(
  //                 Number(ele.index) + 1,
  //                 0,
  //                 removed
  //               );
  //             }
  //           });
  //         }
  //       });
  //     });
  //   }
  // }

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
      //1 append child
      add(index, enterOne.index, idx, enterOne.id);
    }

    if (enterTwo.name == "level-two") {
      addChild(idx, enterTwo);
    }

    if (enterThree.name == "level-three") {
      //1 reorder
      //2 append to sibling
      // submenuOperation(idx, index, enterThree);
      add(index, enterThree.index, idx, enterThree.id);
    }

    if (enterFour.name == "level-four") {
      addChild(idx, enterFour);
    }
   
    if (enterFive.name == "level-five") {
      add(index, enterFive.index, idx, enterFive.id);
    }
   
  }

  return (
    <div className="App">
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
        }}
        onDrop={(e) => {
          let index = e.dataTransfer.getData("index");
          let idx = e.dataTransfer.getData("text");

          handleDragCapture(index, idx);
        }}
      >
        {treee.root.hasChild &&
          treee.root.descendants.map((option, index) => {
            return (
              <div key={index} id={option?.key}>
                <div
                  style={
                    option?.key === enterTwo?.id
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
                  id={option?.key}
                  index={index}
                  draggable="true"
                  onDragStart={(e) => {
                    // e.preventDefault();
                    e.dataTransfer.setData("text", e.currentTarget.id);
                    e.dataTransfer.setData("index", index);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();

                    updateEnterTwo({
                      id: option?.key,
                      name: "level-two",
                      index: `${index}`,
                    });
                    updateEnterFour({
                      id:"",
                      name:"",
                      index:""
                    })
                  }}
                  onDragExitCapture={(e) => {
                    e.preventDefault();
                    updateEnterTwo({
                      id: "",
                      name: "",
                      index: "",
                    });
                  }}
                >
                  <Drag></Drag>
                  <span> </span>
                  {option?.value}
                  <button
                    onClick={() => {
                      updateShow({ bool: !show.bool, id: option?.key });
                    }}
                  >
                    Open
                  </button>
                </div>

                {show.bool &&
                  show.id === option?.key &&
                  option?.descendants.length > 0 && (
                    <div
                      style={{
                        paddingLeft: "20px",
                      }}
                    >
                      {option.descendants.map((child, index) => {
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
                                  child.key === enterFour?.id
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
                                id={child.key}
                                index={index}
                                draggable={true}
                                onDragStart={(e) => {
                                  // e.preventDefault();
                                  e.dataTransfer.setData("text", child.key);
                                  e.dataTransfer.setData("index", index);
                                }}
                                onDragEnter={(e) => {
                                  e.preventDefault();
                                  updateEnterFour({
                                    id: child.key,
                                    name: "level-four",
                                    index: `${index}`,
                                  });
                                  updateEnterTwo({
                                    id:"",
                                    name:"",
                                    index:""
                                  })
                                  updateEnterFive({
                                    id:"",
                                    name:"",
                                    index:""
                                  })
                                }}
                                onDragExit={(e) => {
                                  e.preventDefault();
                                  updateEnterFour({
                                    id: "",
                                    name: "",
                                    index: "",
                                  });
                                  updateEnterThree({
                                    id: "",
                                    name: "",
                                    index: "",
                                  });
                                  updateEnterTwo({
                                    id:"",
                                    name:"",
                                    index:""
                                  })
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
                                  {child.value}
                                  <button
                                    onClick={() => {
                                      updateShowChil({
                                        bool: !showChild.bool,
                                        id: child.key,
                                      });
                                    }}
                                  >
                                    Open
                                  </button>
                                </div>
                              </div>

                              {showChild.bool &&
                                child.key === showChild.id &&
                                child.descendants.length > 0 && (
                                  <div>
                                    {child.descendants.map((subele, index) => {
                                      return (
                                        <div key={index}>
                                          <div
                                            key={index}
                                            style={
                                              subele.key == enterThree.id
                                                ? {
                                                    border: "1px solid black",
                                                    margin: "5px",
                                                    padding: "5px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginLeft: "60px",
                                                    gap: "5px",
                                                  }
                                                : {
                                                    border: "1px solid black",
                                                    margin: "5px",
                                                    padding: "5px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginLeft: "60px",
                                                    gap: "5px",
                                                  }
                                            }
                                            draggable={true}
                                            onDragStart={(e) => {
                                              // e.preventDefault();
                                              e.dataTransfer.setData(
                                                "text",
                                                subele.key
                                              );
                                              e.dataTransfer.setData(
                                                "index",
                                                index
                                              );
                                            }}
                                          >
                                            <Drag strokeWidth={1}></Drag>

                                            {subele.value}
                                          </div>
                                          <div
                                            style={
                                              `${index}` === enterFive.index
                                                ? {
                                                    height: "5px",
                                                    width: "100%",
                                                    borderBottom:
                                                      "4px solid blue",
                                                  }
                                                : {
                                                    height: "5px",
                                                    width: "100%",
                                                  }
                                            }
                                            onDragEnter={(e) => {
                                              e.preventDefault();
                                              updateEnterFive({
                                                id: subele.key,
                                                name: "level-five",
                                                index: `${index}`,
                                              });
                                              updateEnterFour({
                                                id:"",
                                                name:"",
                                                index:""
                                              })
                                              updateEnterThree({
                                                id:"",
                                                name:"",
                                                index:""
                                              })
                                            }}
                                            onDragExit={(e)=>{
                                              e.preventDefault();
                                              updateEnterFive({
                                                id:"",
                                                name:"",
                                                index:""
                                              })
                                            }}
                                          ></div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                            </div>

                            <div
                              style={
                                `${index}` === enterThree.index
                                  ? {
                                      height: "20px",
                                      width: "100%",
                                      borderBottom: "4px solid blue",
                                    }
                                  : {
                                      height: "10px",
                                      width: "100%",
                                    }
                              }
                              onDragEnter={(e) => {
                                e.preventDefault();

                                updateEnterThree({
                                  id: child.key,
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
                                updateEnterThree({
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

                    updateEnterOne({
                      id: option.key,
                      name: "level-one",
                      index: `${index}`,
                    });
                    updateEnterTwo({
                      id: "",
                      name: "",
                      index: "",
                    });
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    updateEnterOne({
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
