import Move from './Move';

interface MoveSet {
  id: string;
  list: Move[];
  index: string;
  color: string;
  droppable: boolean;
}

export default MoveSet;