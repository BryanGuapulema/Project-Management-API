export const validateSchema= (schema, object)=>{
    return schema.safeParse(object)
}

export const validatePartialSchema= (schema, object)=>{
    return schema.partial().safeParse(object)
}
