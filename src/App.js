import React, { useEffect, useState } from "react";
import { data } from "./data";
import { ReactComponent as Drag } from "./drag.svg";
import "./App.css";

// lets create a tree data structure

// we create a class for each node in our treee
class Node {
  // each node has three properties, its value, a pointer
  constructor(key, value = key, parent = null, path = null) {
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
  constructor(key, value = key) {
    this.root = new Node(key, value);
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
        node.descendants.splice(Number(destinationIdx) + 1, 0, obj);
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
        const removed = node.descendants.splice(Number(sourceIdx), 1);
        console.log("me dusri bar remove hua", removed[0]);
        node.descendants.splice(Number(destinationIdx)+1, 0, removed[0]);
        return true;
      }
    }
    return false;
  }
}
const tree = new Tree(1, "tree");
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

function App() {
  const [treee, updateTreee] = useState(tree);

  const level={
    id:"",
    name:"",
    index:""
  }
  //here I am handling states of levels
  const [enterOne, updateEnterOne] = useState(level);
  const [enterTwo, updateEnterTwo] = useState(level);
  const [enterThree, updateEnterThree] = useState(level);
  const [enterFour, updateEnterFour] = useState(level);
  const [enterFive, updateEnterFive] = useState(level);


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
    updateEnterOne(level);
    updateEnterTwo(level);
    updateEnterThree(level);
    updateEnterFour(level);
    updateEnterFive(level);
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
    tree.insertDest(isDestinaton.key, ele.index, isSource);
    updateTreee(tree);
    refresh();
  }

  //handle Drage Capture
  function handleDragCapture(index, idx) {
    if (enterOne.name == "level-one") {
      //1 append child
      // reorder(index,enterOne.index,idx,enterOne.id)
      add(index, enterOne.index, idx, enterOne.id);
    }

    if (enterTwo.name == "level-two") {
      addChild(idx, enterTwo);
    }

    if (enterThree.name == "level-three") {
      //1 reorder
      //2 append to sibling

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
                    updateEnterFour(level);
                    updateEnterOne(level);
                    updateEnterThree(level)
                  }}
                  onDragExitCapture={(e) => {
                    e.preventDefault();
                    updateEnterTwo(level);

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
                                  updateEnterTwo(level);
                                  updateEnterFive(level);
                                }}
                                onDragExit={(e) => {
                                  e.preventDefault();
                                  updateEnterFour(level);
                                  updateEnterThree(level);
                                  updateEnterTwo(level);
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
                                              updateEnterFour(level);
                                              updateEnterThree(level);
                                            }}
                                            onDragExit={(e) => {
                                              e.preventDefault();
                                              updateEnterFive(level);
                                              updateEnterTwo(level)
                                              updateEnterThree(level)
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
                                updateEnterOne(level);
                                updateEnterTwo(level);
                                updateEnterFour(level);
                                updateEnterFive(level)
                              }}
                              onDragLeave={(e) => {
                                e.preventDefault();
                                updateEnterThree(level);

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
                    updateEnterTwo(level);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    updateEnterOne(level);
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
