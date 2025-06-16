package tech.linuxcat.saes4.types

@kotlinx.serialization.Serializable
data class User(val login : String, val email : String, val password : String, val token : String, val like : List<Vol>)