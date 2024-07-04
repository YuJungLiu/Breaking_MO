import Move from "./Move";

interface MoveSet {
  id: string;
  list: Move[];
  index: string;
  color: string;
  droppable: boolean;
}

interface ColumnProps {
  control: MoveSet[];
  data: MoveSet[];
}

export default ColumnProps;
