import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('sustainSportsUserOrders') || '[]');
    setOrders(allOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleUpdateOrder = (orderId, field, value) => {
    // Update state immediately for responsiveness
    setOrders(currentOrders =>
      currentOrders.map(order =>
        order.id === orderId ? { ...order, [field]: value } : order
      )
    );
  };

  const handleSaveChanges = (orderToSave) => {
    try {
      // Read all orders from localStorage
      const allOrders = JSON.parse(localStorage.getItem('sustainSportsUserOrders') || '[]');
      
      // Find and replace the updated order
      const updatedOrders = allOrders.map(order =>
        order.id === orderToSave.id ? orderToSave : order
      );

      // Save back to localStorage
      localStorage.setItem('sustainSportsUserOrders', JSON.stringify(updatedOrders));

      toast({
        title: "Order Updated! 🚀",
        description: `Successfully updated order ${orderToSave.id}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save order changes to localStorage.",
      });
      // Reload from storage to revert optimistic update
      loadOrders(); 
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'Delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Processing':
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Manage Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer (Email)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Tracking #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-xs">{order.id}</TableCell>
                  <TableCell>{order.userId}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      placeholder="Add tracking #"
                      value={order.trackingNumber || ''}
                      onChange={(e) => handleUpdateOrder(order.id, 'trackingNumber', e.target.value)}
                      className="w-40"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleUpdateOrder(order.id, 'status', value)}
                    >
                      <SelectTrigger className="w-40">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <SelectValue placeholder="Set status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => handleSaveChanges(order)}>
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminOrderList;