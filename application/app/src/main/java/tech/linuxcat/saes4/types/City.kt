package tech.linuxcat.saes4.types

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import kotlinx.parcelize.RawValue


/**
 * Le type correspondant a une ville (City).
 * @param nom Le nom de la ville
 * @param pays Le pays dans lequel se situe la ville
 * @param lon La longitude a laquelle se situe la ville
 * @param lat La latitude a laquelle se situe la ville
 * @param image une image de la ville
 * @param lieux une liste de lieux (Place) qui sont dans la ville
 * @author Martin Schreiber
 */
@kotlinx.serialization.Serializable
@Parcelize
data class City(var nom : String, var pays : String, var lon : Double, var lat : Double, var image : String, var lieux : List<Place>, var aeros : List<Airport>) : Parcelable