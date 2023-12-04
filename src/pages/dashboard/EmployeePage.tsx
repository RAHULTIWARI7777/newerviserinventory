// Import necessary dependencies and components
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import Spinner from '../../components/general/Spinner';
import InputField from '../../components/general/InputField';
import Button from '../../components/general/Button';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ICreateEmployeeDto, IEmployee } from '../../types/employee.types';
import moment from 'moment';
import { PictureAsPdf } from '@mui/icons-material';
import * as XLSX from 'xlsx';

// Import constants
import { EMPLOYEE_GET_URL, EMPLOYEE_CREATE_URL, HOST_API_KEY } from '../../utils/globalConfig';

const EmployeePage = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Define employee schema and form control
  const employeeSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    joiningDate: Yup.string().required('Joining Date is required'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICreateEmployeeDto>({
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      joiningDate: '',
    },
  });

  // Fetch employees on component mount
  useEffect(() => {
    getEmployeesList();
  }, []);

  // Function to fetch employees
  const getEmployeesList = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IEmployee[]>(EMPLOYEE_GET_URL);
      const { data } = response;
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      toast.error('An error occurred. Please contact admins');
      setLoading(false);
    }
  };

  // Function to handle form submission
  const onSubmitEmployeeForm = async (submittedData: ICreateEmployeeDto) => {
    try {
      setLoading(true);

      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('firstName', submittedData.firstName);
      formData.append('lastName', submittedData.lastName);
      formData.append('email', submittedData.email);
      formData.append('phone', submittedData.phone);
      formData.append('joiningDate', submittedData.joiningDate);

      // Add an empty file field if no file is selected
      formData.append('pdfFile', new File([], 'empty-file.txt'));

      // Assuming you have the pdfFile input element reference
      const pdfFileInput = document.getElementById('pdfFile') as HTMLInputElement;

      // Check if a file is selected
      if (pdfFileInput?.files?.length) {
        formData.set('pdfFile', pdfFileInput.files[0]);
      }

      // Make POST request to create employee
      await axiosInstance.post(EMPLOYEE_CREATE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);
      toast.success('Employee created successfully.');
      getEmployeesList(); // Refresh the list after creating a new employee
      reset();
    } catch (error) {
      setLoading(false);
      reset();
      const err = error as { data: string; status: number };
      if (err.status === 400) {
        toast.error(err.data);
      } else {
        toast.error('An error occurred. Please contact admins');
      }
    }
  };

  // Function to handle Excel download
  const handleDownloadExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(employees.map(({ documentUrl, ...rest }) => rest));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employees');
      XLSX.writeFile(wb, 'employees.xlsx');
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      toast.error('An error occurred while downloading the Excel file.');
    }
  };

  // Render UI
  return (
    <div className='pageTemplate2'>
      <h1 className='text-2xl font-bold'>Employee Management</h1>

      {/* Section for entering new employee data */}
      <div className='pageTemplate3 items-stretch'>
        <form onSubmit={handleSubmit(onSubmitEmployeeForm)}>
          <div className='flex gap-2 mt-2'>
            <InputField control={control} label='First Name' inputName='firstName' error={errors.firstName?.message} />
            <InputField control={control} label='Last Name' inputName='lastName' error={errors.lastName?.message} />
            <InputField control={control} label='Email' inputName='email' error={errors.email?.message} />
          </div>
          <div className='flex gap-2 mt-2'>
            <InputField control={control} label='Phone' inputName='phone' error={errors.phone?.message} />
            <InputField control={control} label='Joining Date' inputName='joiningDate' error={errors.joiningDate?.message} />
            <div className='flex gap-2 items-center'>
              <label htmlFor='pdfFile' className='font-semibold'>
                PDF File:
              </label>
              <input
                type='file'
                id='pdfFile'
                name='pdfFile'
                accept='.pdf'
                onChange={(e) => {
                  // Handle file upload logic if needed
                }}
              />
            </div>
          </div>
          <div className='flex justify-end items-center gap-4 mt-6'>
            <Button variant='secondary' type='button' label='Discard' onClick={() => reset()} />
            <Button variant='primary' type='submit' label='Save' onClick={() => {}} loading={loading} />
          </div>
        </form>
      </div>

      {/* Section for displaying saved employee data */}
      <div className='pageTemplate3 items-stretch mt-8'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold'>Saved Employees</h2>
          <div className='flex gap-4'>
            <Button variant='secondary' label='Upload Excel' onClick={() => {}} type={'button'} />
            <Button variant='primary' label='Download Excel' onClick={handleDownloadExcel} type={'button'} />
          </div>
        </div>
        <div className='grid grid-cols-7 px-2 my-1 text-lg font-semibold border border-gray-300 rounded-md'>
          <div className='max-w-[50px] overflow-hidden'>Id</div>
          <div>First Name</div>
          <div>Last Name</div>
          <div>Phone</div>
          <div>Joining Date</div>
          <div>Pdf</div>
          <div>Created At</div>
        </div>
        {employees.map((employee, index) => (
          <div key={index} className='grid grid-cols-7 px-2 h-12 my-1 border border-gray-200 hover:bg-gray-200 rounded-md'>
            <div className='flex items-center max-w-[50px] overflow-hidden'>{employee.id}</div>
            <div className='flex items-center'>{employee.firstName}</div>
            <div className='flex items-center'>{employee.lastName}</div>
            <div className='flex items-center'>{employee.phone}</div>
            <div className='flex items-center'>{employee.joiningDate}</div>
            <div className='flex items-center'>
              <a href={`${HOST_API_KEY}/Employee/download/${employee.documentUrl}`} download>
                <PictureAsPdf />
              </a>
            </div>
            <div className='flex items-center'>{moment(employee.createdAt).format('YYYY-MM-DD|HH:mm')}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeePage;
