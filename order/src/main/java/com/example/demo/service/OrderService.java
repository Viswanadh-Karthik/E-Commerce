package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.client.InventoryClient;
import com.example.demo.entity.Order;
import com.example.demo.repository.OrderRepository;

@Service
public class OrderService {
	
	@Autowired
	private OrderRepository orderRepo;
	
	@Autowired
	private InventoryClient client;
	
	public Order placeOrder(Order order) {
		boolean isAvailable = client.checkInventory(order.getProduct(), order.getQuantity());
		if(!isAvailable) {
			throw new RuntimeException("Product Not Available");
		}
		client.reduceStock(order.getProduct(), order.getQuantity());
		
		return orderRepo.save(order);
	}
	public List<Order> getAllOrder(){
		return orderRepo.findAll();
	}
	public Order getOrderById(Long id) {
		return orderRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Order Not Found"));
	}
	public Order updateOrder(Long id, Order updatedOrder) {
		Order existingOrder = getOrderById(id);
		
		// Calculate the difference in quantity
		int quantityDifference = updatedOrder.getQuantity() - existingOrder.getQuantity();
		
		if (quantityDifference != 0) {
			// If increasing quantity, check if enough stock is available
			if (quantityDifference > 0) {
				boolean isAvailable = client.checkInventory(existingOrder.getProduct(), quantityDifference);
				if (!isAvailable) {
					throw new RuntimeException("Not enough stock available for the requested quantity");
				}
				// Reduce stock for the additional quantity
				client.reduceStock(existingOrder.getProduct(), quantityDifference);
			} else {
				// If decreasing quantity, add back the difference to inventory
				// We don't need to check availability since we're returning stock
				client.addStock(existingOrder.getProduct(), -quantityDifference);
			}
		}
		
		// Update the order
		existingOrder.setQuantity(updatedOrder.getQuantity());
		existingOrder.setProduct(updatedOrder.getProduct());
		return orderRepo.save(existingOrder);
	}
	public void deleteOrder(Long id) {
		orderRepo.deleteById(id);
	}
}
