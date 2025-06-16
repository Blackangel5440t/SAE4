package tech.linuxcat.saes4.types

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
@kotlinx.serialization.Serializable
data class Airport(var id : String, var nom : String, var ville_nom : String, var vols : List<Vol>) : Parcelable