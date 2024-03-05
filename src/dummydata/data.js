import { v4 as uuidv4 } from "uuid";
export const tag = [
  {
    id: uuidv4(),
    type: "ul",
    attributes: {
      id: "my-ul",
      name: "<ul> </ul>",
      className: "mynav",
      style: {
        // overflow: "hidden",
        // backgroundColor: "#333",
        // position: "relative",
        listStyleType: "none",
        alignSelf: "center",
      },
    },
    children: [],
  },
  {
    id: uuidv4(),
    type: "li",
    attributes: {
      id: "my-li",
      name: "<li> </li>",
      className: "mynav",
      style: {
        // overflow: "hidden",
        // backgroundColor: "#333",
        // position: "relative",
        alignSelf: "center",
      },
    },
    children: [],
  },
  {
    id: uuidv4(),
    type: "div",
    attributes: {
      name: "<div> </div>",
      style: {
        height: "100%",
        width: "100%",
        alignSelf: "center",
      },
    },
    children: [],
  },
  {
    id: uuidv4(),
    type: "p",
    attributes: {
      name: "<p></p>",
      style: {
        height: "100%",
        width: "100%",
        alignSelf: "center",
      },
    },
    children: [],
  },
];
