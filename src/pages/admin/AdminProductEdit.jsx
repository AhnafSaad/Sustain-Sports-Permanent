import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const AdminProductEdit = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both the product details and the list of all categories
        const [{ data: productData }, { data: categoriesData }] = await Promise.all([
          axios.get(`/api/admin/products/${productId}`),
          axios.get('/api/categories')
        ]);
        setProduct(productData);
        setCategories(categoriesData);
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load data.';
        setError(message);
        toast({ variant: 'destructive', title: 'Error', description: message });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'features' || name === 'images') {
      // প্রতিটি লাইনকে (\n) একটি আলাদা অ্যারে আইটেম হিসাবে ভাগ করা হয়
      const newArray = value.split('\n').filter(f => f.trim() !== '');
      setProduct({ ...product, [name]: newArray });
    } else {
      // অন্যান্য সকল ইনপুট স্বাভাবিকভাবে হ্যান্ডেল করা হয়
      setProduct({ ...product, [name]: value });
    }
  };
  
  const handleSelectChange = (value) => {
    setProduct({ ...product, category: value });
  };

  const handleCheckboxChange = (checked) => {
    setProduct({ ...product, inStock: checked });
  };
  
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/products/${productId}`, product);
      toast({ title: 'Success', description: 'Product updated successfully.' });
      navigate('/admin/dashboard/products');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update product.';
      toast({ variant: 'destructive', title: 'Error', description: message });
    }
  };

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      {product && (
        <form onSubmit={submitHandler} className="space-y-4 max-w-lg">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={product.name} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" type="number" step="0.01" value={product.price} onChange={handleInputChange} />
          </div>
           
           <div>
            {/* --- বাংলা লেখা সরানো হয়েছে --- */}
            <Label htmlFor="images">Product Images (One URL per line)</Label>
            <Textarea 
              id="images" 
              name="images" 
              value={(product.images || []).join('\n')} 
              onChange={handleInputChange} 
              rows={4} 
              placeholder="Image URL 1&#10;Image URL 2&#10;Image URL 3"
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select value={product.category?._id || product.category} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description">Short Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={product.description} 
              onChange={handleInputChange} 
              rows={3} 
            />
          </div>
          <div>
            <Label htmlFor="fullDescription">Full Description (Main Page)</Label>
            <Textarea 
              id="fullDescription" 
              name="fullDescription" 
              value={product.fullDescription} 
              onChange={handleInputChange} 
              rows={6} 
            />
          </div>

          <div>
            {/* --- বাংলা লেখা সরানো হয়েছে --- */}
            <Label htmlFor="features">Key Features (One per line)</Label>
            <Textarea 
              id="features" 
              name="features" 
              value={(product.features || []).join('\n')} 
              onChange={handleInputChange} 
              rows={4} 
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="inStock" checked={product.inStock} onCheckedChange={handleCheckboxChange} />
            <Label htmlFor="inStock">In Stock</Label>
          </div>
          <Button type="submit">Update Product</Button>
        </form>
      )}
    </div>
  );
};

export default AdminProductEdit;
