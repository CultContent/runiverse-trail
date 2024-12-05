interface Attribute {
  trait_type: string;
  value: string | number;
  original_value?: string | number;
  filename: string | null;
}

interface Character {
  // ... existing properties ...
  originalAttributes?: Attribute[];
} 