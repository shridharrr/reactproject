import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const YourComponent = () => {
  const [claimStatus, setClaimStatus] = useState('Yes');
  const [customerApprovalStatus, setCustomerApprovalStatus] = useState('Yes');
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [itServices, setITServices] = useState('Yes');
  const [amenities, setAmenities] = useState('');
  const [labor, setLabor] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [rate, setRate] = useState(0);
  const [gstPercentage, setGstPercentage] = useState(0);
  const [taxableAmount, setTaxableAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchSuppliers();
    fetchWarehouses();
  }, []);

  const fetchSuppliers = () => {
    axios
      .get('http://localhost:8080/suppliers')
      .then((response) => {
        setSuppliers(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch suppliers:', error);
      });
  };

  const fetchWarehouses = () => {
    axios
      .get('http://localhost:8080/warehouses')
      .then((response) => {
        setWarehouses(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch warehouses:', error);
      });
  };

  const handleSupplierChange = (e) => {
    setSelectedSupplier(e.target.value);
  };

  const handleWarehouseChange = (e) => {
    setSelectedWarehouse(e.target.value);
  };

  useEffect(() => {
    const basicAmount = quantity * rate;
    const taxable = basicAmount + gstAmount;
    const calculatedGstAmount = (gstPercentage * taxable) / 100;
    const calculatedTotalAmount = taxable + calculatedGstAmount;

    setTaxableAmount(taxable);
    setGstAmount(calculatedGstAmount);
    setTotalAmount(calculatedTotalAmount);
  }, [quantity, rate, gstPercentage]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const supplierData = {
      claimStatus,
      customerApprovalStatus,
      selectedSupplier,
      selectedWarehouse,
      itServices,
      amenities,
      labor,
      quantity,
      rate,
      gstPercentage,
      taxableAmount,
      gstAmount,
      totalAmount,
    };

    axios
      .post('http://localhost:8080/suppliers', supplierData)
      .then((response) => {
        console.log('Supplier created:', response.data);
      })
      .catch((error) => {
        console.error('Failed to create supplier:', error);
      });
  };

  return (
    <div className="container">
      <header>Form</header>
      <form onSubmit={handleSubmit}>
        <div className="form">
          <div className="title">Claim Status</div>
          <select value={claimStatus} onChange={(e) => setClaimStatus(e.target.value)}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <div className="title">Customer Approval Status</div>
          <select value={customerApprovalStatus} onChange={(e) => setCustomerApprovalStatus(e.target.value)}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <div className="title">Supplier</div>
          <select value={selectedSupplier} onChange={handleSupplierChange}>
            <option value="">Select a supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.sname}
              </option>
            ))}
          </select>

          <div className="title">Warehouse</div>
          <select value={selectedWarehouse} onChange={handleWarehouseChange}>
            <option value="">Select a warehouse</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.sname}
              </option>
            ))}
          </select>

          <div className="title">IT Services</div>
          <select value={itServices} onChange={(e) => setITServices(e.target.value)}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <div className="title">Amenities</div>
          <select value={amenities} onChange={(e) => setAmenities(e.target.value)}>
            <option value="">Select an amenity</option>
            <option value="Amenity 1">Amenity 1</option>
            <option value="Amenity 2">Amenity 2</option>
            <option value="Amenity 3">Amenity 3</option>
          </select>

          <div className="title">Labor</div>
          <select value={labor} onChange={(e) => setLabor(e.target.value)}>
            <option value="">Select labor</option>
            <option value="Labor 1">Labor 1</option>
            <option value="Labor 2">Labor 2</option>
            <option value="Labor 3">Labor 3</option>
          </select>

          <div className="title">Quantity</div>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

          <div className="title">Rate</div>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />

          <div className="title">GST Percentage</div>
          <input type="number" value={gstPercentage} onChange={(e) => setGstPercentage(e.target.value)} />

          <div className="title">Taxable Amount</div>
          <input type="number" value={taxableAmount} readOnly />

          <div className="title">GST Amount</div>
          <input type="number" value={gstAmount} readOnly />

          <div className="title">Total Amount</div>
          <input type="number" value={totalAmount} readOnly />

          <button type="submit">Submit</button>
        </div>
        <div className="progress-bar"></div>
      </form>
      <button className="backBtn">Back</button>
    </div>
  );
};

export default YourComponent;
