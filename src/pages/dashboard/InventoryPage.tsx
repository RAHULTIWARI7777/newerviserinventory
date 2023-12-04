import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import Spinner from '../../components/general/Spinner';
import Button from '../../components/general/Button';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ICreateHardwareInfoDto, IHardwareInfo } from '../../types/inventory.types';
import MenuItem from '@mui/material/MenuItem';
import { Box, FormControl, InputLabel, Select, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { INVENTORY_GET_URL, INVENTORY_CREATE_URL } from '../../utils/globalConfig';
import InputField from '../../components/general/InputField';

// ... (previous imports)

const InventoryPage = () => {
  const [hardwareItems, setHardwareItems] = useState<IHardwareInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Define hardware schema and form control
  const hardwareSchema = Yup.object().shape({
    type: Yup.string().required('Type is required'),
    id: Yup.string().required('ID is required'),
    createdAt: Yup.string().required('CreatedAt is required'),
    serialNo: Yup.string().required('Serial No is required'),
    purchaseDate: Yup.string().required('Purchase Date is required'),
    warrantyEndDate: Yup.string().required('Warranty End Date is required'),
    condition: Yup.string().required('Condition is required'),
    location: Yup.string().required('Location is required'),
    notes: Yup.string().required('Notes is required'),
    manufacturer: Yup.string().required('Manufacturer is required'),
    model: Yup.string().required('Model is required'),
    assetTag: Yup.string().required('Asset Tag is required'),
    brand: Yup.string().required('Brand is required'),
    purchaseOrderNumber: Yup.string().required('Purchase Order Number is required'),
    assignedDate: Yup.string().required('Assigned Date is required'),
    retiredDate: Yup.string().nullable(),
    maintenanceSchedule: Yup.string().required('Maintenance Schedule is required'),
    assignedBy: Yup.string().required('Assigned By is required'),
    lastServiceDate: Yup.string().nullable(),
    replacementDate: Yup.string().nullable(),
    supportContact: Yup.string().required('Support Contact is required'),
    disposalMethod: Yup.string().required('Disposal Method is required'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm<IHardwareInfo>({
    resolver: yupResolver(hardwareSchema),
    defaultValues: {
      type: '',
      id: '',
      createdAt: '',
      serialNo: '',
      purchaseDate: '',
      warrantyEndDate: '',
      condition: '',
      location: '',
      notes: '',
      manufacturer: '',
      model: '',
      assetTag: '',
      brand: '',
      purchaseOrderNumber: '',
      assignedDate: '',
      retiredDate: null,
      maintenanceSchedule: '',
      assignedBy: '',
      lastServiceDate: null,
      replacementDate: null,
      supportContact: '',
      disposalMethod: '',
    },
  });

  // Fetch hardware items on component mount
  useEffect(() => {
    getHardwareItemsList();
  }, []);

  // Function to fetch hardware items
  const getHardwareItemsList = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IHardwareInfo[]>(INVENTORY_GET_URL);
      const { data } = response;
      setHardwareItems(data);
      setLoading(false);
    } catch (error) {
      toast.error('An error occurred. Please contact admins');
      setLoading(false);
    }
  };

  // Function to handle form submission
  const onSubmitHardwareForm = async (submittedData: ICreateHardwareInfoDto) => {
    try {
      setLoading(true);

      const newHardwareItem: ICreateHardwareInfoDto = {
        type: submittedData.type,
        id: submittedData.id,
        createdAt: submittedData.createdAt,
        serialNo: submittedData.serialNo,
        purchaseDate: submittedData.purchaseDate,
        warrantyEndDate: submittedData.warrantyEndDate,
        condition: submittedData.condition,
        location: submittedData.location,
        notes: submittedData.notes,
        manufacturer: submittedData.manufacturer,
        model: submittedData.model,
        assetTag: submittedData.assetTag,
        brand: submittedData.brand,
        purchaseOrderNumber: submittedData.purchaseOrderNumber,
        assignedDate: submittedData.assignedDate,
        retiredDate: submittedData.retiredDate,
        maintenanceSchedule: submittedData.maintenanceSchedule,
        assignedBy: submittedData.assignedBy,
        lastServiceDate: submittedData.lastServiceDate,
        replacementDate: submittedData.replacementDate,
        supportContact: submittedData.supportContact,
        disposalMethod: submittedData.disposalMethod,
      };

      // Send data in the request body
      await axiosInstance.post(INVENTORY_CREATE_URL, newHardwareItem);

      setLoading(false);
      toast.success('Hardware item created successfully.');
      getHardwareItemsList(); // Refresh the list after creating a new hardware item
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

  // Render UI
  return (
    <div className='pageTemplate2'>
      <h1 className='text-2xl font-bold'>Inventory Management</h1>

      {/* Section for entering new hardware item data */}
      <div className='pageTemplate3 items-stretch'>
        <form onSubmit={handleSubmit(onSubmitHardwareForm)}>
          <div className='mb-4'>
            <Box>
              <FormControl style={{ width: '100%' }} size='small'>
                <InputLabel id='demo-simple-select-helper-label'>Type</InputLabel>
                <Select labelId='demo-simple-select-helper-label' id='demo-simple-select-helper' label='Type' {...register('type')} size='small'>
                  <MenuItem value='Laptop'>Laptop</MenuItem>
                  {/* Add more menu items based on your hardware types */}
                </Select>
              </FormControl>
            </Box>
            <p className='mt-2 text-sm text-red-600'>{errors.type?.message}</p>
          </div>

          {/* Input field for 'id' */}
          <div className='mb-4'>
            <InputField label='ID' inputName='id' error={errors.id?.message} {...register('id')} />
          </div>

          {/* Input field for 'createdAt' */}
          <div className='mb-4'>
            <InputField label='CreatedAt' inputName='createdAt' error={errors.createdAt?.message} {...register('createdAt')} />
          </div>

          {/* Input field for 'serialNo' */}
          <div className='mb-4'>
            <InputField label='Serial No' inputName='serialNo' error={errors.serialNo?.message} {...register('serialNo')} />
          </div>

          {/* Input field for 'purchaseDate' */}
          <div className='mb-4'>
            <InputField label='Purchase Date' inputName='purchaseDate' error={errors.purchaseDate?.message} {...register('purchaseDate')} />
          </div>

          {/* Input field for 'warrantyEndDate' */}
          <div className='mb-4'>
            <InputField label='Warranty End Date' inputName='warrantyEndDate' error={errors.warrantyEndDate?.message} {...register('warrantyEndDate')} />
          </div>

          {/* Input field for 'condition' */}
          <div className='mb-4'>
            <InputField label='Condition' inputName='condition' error={errors.condition?.message} {...register('condition')} />
          </div>

          {/* Input field for 'location' */}
          <div className='mb-4'>
            <InputField label='Location' inputName='location' error={errors.location?.message} {...register('location')} />
          </div>

          {/* Input field for 'notes' */}
          <div className='mb-4'>
            <InputField label='Notes' inputName='notes' error={errors.notes?.message} {...register('notes')} />
          </div>

          {/* Input field for 'manufacturer' */}
          <div className='mb-4'>
            <InputField label='Manufacturer' inputName='manufacturer' error={errors.manufacturer?.message} {...register('manufacturer')} />
          </div>

          {/* Input field for 'model' */}
          <div className='mb-4'>
            <InputField label='Model' inputName='model' error={errors.model?.message} {...register('model')} />
          </div>

          {/* Input field for 'assetTag' */}
          <div className='mb-4'>
            <InputField label='Asset Tag' inputName='assetTag' error={errors.assetTag?.message} {...register('assetTag')} />
          </div>

          {/* Input field for 'brand' */}
          <div className='mb-4'>
            <InputField label='Brand' inputName='brand' error={errors.brand?.message} {...register('brand')} />
          </div>

          {/* Input field for 'purchaseOrderNumber' */}
          <div className='mb-4'>
            <InputField label='Purchase Order Number' inputName='purchaseOrderNumber' error={errors.purchaseOrderNumber?.message} {...register('purchaseOrderNumber')} />
          </div>

          {/* Input field for 'assignedDate' */}
          <div className='mb-4'>
            <InputField label='Assigned Date' inputName='assignedDate' error={errors.assignedDate?.message} {...register('assignedDate')} />
          </div>

          {/* Input field for 'retiredDate' */}
          <div className='mb-4'>
            <InputField label='Retired Date' inputName='retiredDate' error={errors.retiredDate?.message} {...register('retiredDate')} />
          </div>

          {/* Input field for 'maintenanceSchedule' */}
          <div className='mb-4'>
            <InputField label='Maintenance Schedule' inputName='maintenanceSchedule' error={errors.maintenanceSchedule?.message} {...register('maintenanceSchedule')} />
          </div>

          {/* Input field for 'assignedBy' */}
          <div className='mb-4'>
            <InputField label='Assigned By' inputName='assignedBy' error={errors.assignedBy?.message} {...register('assignedBy')} />
          </div>

          {/* Input field for 'lastServiceDate' */}
          <div className='mb-4'>
            <InputField label='Last Service Date' inputName='lastServiceDate' error={errors.lastServiceDate?.message} {...register('lastServiceDate')} />
          </div>

          {/* Input field for 'replacementDate' */}
          <div className='mb-4'>
            <InputField label='Replacement Date' inputName='replacementDate' error={errors.replacementDate?.message} {...register('replacementDate')} />
          </div>

          {/* Input field for 'supportContact' */}
          <div className='mb-4'>
            <InputField label='Support Contact' inputName='supportContact' error={errors.supportContact?.message} {...register('supportContact')} />
          </div>

          {/* Input field for 'disposalMethod' */}
          <div className='mb-4'>
            <InputField label='Disposal Method' inputName='disposalMethod' error={errors.disposalMethod?.message} {...register('disposalMethod')} />
          </div>

          {/* Input fields for other properties */}
          {/* ... (Add input fields for other properties based on ICreateHardwareInfoDto) */}

          <div className='flex justify-center items-center gap-4 mt-6'>
            <Button variant='secondary' type='button' label='Discard' onClick={() => reset()} />
            <Button variant='primary' type='submit' label='Save' onClick={() => { }} loading={loading} />
          </div>
        </form>
      </div>

      {/* Section for displaying saved hardware items */}
      <div className='pageTemplate3 items-stretch mt-8'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold'>Saved Hardware Items</h2>
        </div>
        <div className='grid grid-cols-7 px-2 my-1 text-lg font-semibold border border-gray-300 rounded-md'>
          <div className='max-w-[50px] overflow-hidden'>ID</div>
          <div>Type</div>
          {/* Add more headers based on your data structure */}
        </div>
        {hardwareItems.map((hardwareItem, index) => (
          <div key={index} className='grid grid-cols-7 px-2 h-12 my-1 border border-gray-200 hover:bg-gray-200 rounded-md'>
            <div className='flex items-center max-w-[50px] overflow-hidden'>{hardwareItem.id}</div>
            <div className='flex items-center'>{hardwareItem.type}</div>
            {/* Add more cells based on your data structure */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;

