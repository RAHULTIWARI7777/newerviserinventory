export interface IEmployee {
    joiningDate: string;
   
    id : string;
    firstName:string;
    lastName:string;
    email:string;
    phone:string;
    documentUrl:string
    createdAt : string;

}

export interface ICreateEmployeeDto {
    firstName:string;
    lastName:string;
    email:string;
    phone:string;
    joiningDate:string;

    
}