import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import Move from "./Move";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

interface ItemProps {
  move: Move;
  index: number;
}

const colors = {
  "Go Down": "rgb(255, 225, 204)",
  Freeze: "rgb(181, 227, 232)",
  Footwork: "rgb(254, 242, 205)",
  Power: "rgb(253, 247, 78)",
  "孫振 MIND": "rgb(251, 218, 215)",
  開場技: "rgb(217, 231, 253)",
  "Back Rock": "rgb(209, 241, 218)",
};

const StyledItem = styled.div<{ $inputColor: string; $usedCount: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  padding: 4px 8px;
  transition: background-color 0.8s ease-out;
  margin-top: 8px;
  color: black;
  background-color: ${(props) => colors[props.$inputColor]};
  opacity: ${(props) => (props.$usedCount == 0 ? 1 : 1-0.2*props.$usedCount)};
  position: relative;
`;

const StyledBadge = styled.div<{ $usedCount: number}>`
  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(.5em) translateY(-.5em);
  background-color: whitesmoke;
  border-radius: 15px;
  color: black;
  padding: 0.25rem;
  opacity: 1;
  font-size: .75rem;
`

const Item: React.FC<ItemProps> = ({ move, index }) => {
  return (
    <Draggable draggableId={move.name} index={index}>
      {(provided) => (
        <StyledItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          $inputColor={move.id}
          $usedCount={move.usedCount}
        >
          {move.name} &nbsp;
          <div style={{display: "flex", alignItems: "center", marginRight: ".5rem"}}>
          {
            Array.from(Array(Math.floor(move.hard)), (e, i) => {
              return  <FaStar color="hsla(15, 99%, 60%, 1)" style={{filter: `drop-shadow(0px 2px 2px hsla(35, 99%, 50%, 1))`}}/>
            })
          }
          {
            move.hard % 1 != 0 && <FaStarHalfAlt color="hsla(15, 99%, 60%, 1)" style={{filter: `drop-shadow(0px 2px 2px hsla(35, 99%, 50%, 1))`}}/>
          }
          </div>
          
          <StyledBadge $usedCount={move.usedCount}>{move.usedCount}</StyledBadge>
        </StyledItem>
      )}
    </Draggable>
  );
};

export default Item;
