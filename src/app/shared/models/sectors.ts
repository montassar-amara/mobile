export interface IRating{
    name:string;
    _id:string;
    logo:string;
}
export interface ISector{
    name:string;
    _id:string;
    ratings:IRating[];
    estimations:IEstimation[];
}
export interface IEstimation{
    name:string;
    _id:string;
}

export interface IValuation{
    name:string;
    _id:string;
}

export interface ITab{
  sector_id: string;
  name:string;
  _id:string;
}

export interface IColumn {
  sector_tab_id: string;
  name:string;
  _id:string;
}

export interface IColumnValue {
  sector_column_id: string;
  sector_company_id: string;
  value:string;
  _id:string;
}
