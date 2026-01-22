export type Specification = {
  property: string;
  value: string;
};

export type ProductData = {
  id: number;
  title: string;
  subTitle: string;
  description: string;
  specifications: Specification[];
  appData: string;
  packaging: string[];
  SBU: string;
  industrial: string;
  documentation: string;
  alternatives: string[];
  related: string[];
};