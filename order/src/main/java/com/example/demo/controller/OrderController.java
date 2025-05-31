package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Order;
import com.example.demo.service.OrderService;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {
	
	@Autowired
	private OrderService orderService;
	
	@PostMapping
	public ResponseEntity<Order> placeOrder(@RequestBody Order order){
		Order createdOrder = orderService.placeOrder(order);
		return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
	}
	@GetMapping
	public List<Order> getAllOrders(){
		return orderService.getAllOrder();
	}
	@GetMapping("/{id}")
	public ResponseEntity<Order> getOrderById(@PathVariable Long id){
		Order order = orderService.getOrderById(id);
		return ResponseEntity.ok(order);
	}
	@PutMapping("/{id}")
	public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order updateOrder){
		Order order = orderService.updateOrder(id, updateOrder);
		return ResponseEntity.ok(order);
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteOrder(@PathVariable Long id){
		orderService.deleteOrder(id);
		return new ResponseEntity<>("Order deleted succesfully", HttpStatus.OK);
	}
}
