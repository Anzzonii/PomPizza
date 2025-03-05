package com.aps.PomPizza.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/pedidos")
@Controller
public class PedidoController {

    @GetMapping()
    public String showPedidos(){
        return "pedidos";
    }

    @GetMapping("/user/crearNuevoPedido")
    public String showAddPedido(){
        return "addPedido";

    }
}
