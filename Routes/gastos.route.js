
const express=require("express")
const router=express.Router();




let gastos = [
  { id: 1, nombre: "Gasto 1", fecha: "2024-06-02", monto: 150 },
  { id: 2, nombre: "Gasto 2", fecha: "2024-06-18", monto: 300 },
];

router.get("/",(req,res)=>{
    res.json(gastos)
})


router.post("/",(req,res)=>{
    const {nombre,fecha,monto}=req.body
    if(!nombre || !fecha || !monto){
        return res.status(400).json({error:"faltan datos Obligatorios"})
    }
    const nuevoGasto={
        id:gastos.length +1,
        nombre,
        fecha,
        monto
    }
    gastos.push(nuevoGasto)
    res.status(201).json(nuevoGasto)
})

router.delete("/:id",(req,res)=>{
    const {id}=req.params
    gastos=gastos.filter((gasto)=>gasto.id !== parseInt(id))
    res.status(204).json({message:"gasto eliminado"})
})

module.exports=router;