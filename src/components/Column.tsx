import React from 'react'
import Item from './Item'
import { Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import Move from './Move'

interface ColumnProps {
  col: {
    id: string
    list: Move[]
    index: string
    color: string
    droppable: boolean
  }
}

const StyledColumn = styled.div<{$isDroppable: boolean}>`
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  transition: opacity .2s ease;
  min-height: 50vh;
  opacity: ${props => props.$isDroppable?1:0.3};
  h2: {
    margin: 0;
    padding: 0 16px;
  }
`

const StyledList = styled.div`
  background-color: #bbb;
  border-radius: 8px;
  padding: 16px;
  // display: grid;
  // grid-template-columns: 1fr 1fr;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-top: 8px;
`

const Column: React.FC<ColumnProps> = ({ col: { list, id, index, color, droppable } }) => {
  return (
    <Droppable droppableId={index} isDropDisabled={!droppable}>
      {provided => (
        <StyledColumn $isDroppable={droppable}>
          {
            id.includes("Round") && <h2>{id}</h2>
          }
          <StyledList {...provided.droppableProps} ref={provided.innerRef} color={color}>
            {list.map((move, index) => (
              <Item key={move.name} move={move} index={index} />
            ))}
            {provided.placeholder}
          </StyledList>
        </StyledColumn>
      )}
    </Droppable>
  )
}

export default Column
