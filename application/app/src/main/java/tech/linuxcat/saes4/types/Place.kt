package tech.linuxcat.saes4.types

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/**
 * Le type correspondant a un lieu (place).
 * @param nom Le nom du lieu
 * @param description la description du lieu
 * @param adresse L'adresse du lieu
 * @param image Une url vers une image
 * @param auteur L'auteur de l'avis
 * @param avis L'avis
 * @param rate La note de l'avis
 * @param temps La date et heure a laquelle l'avis a été écrit.
 * @author Martin Schreiber
 */
@kotlinx.serialization.Serializable
@Parcelize
data class Place (var nom : String, var description : String, var adresse : String, var image : String, var auteur : String, var avis : String, var rate : Float, var temps : String, var villenom : String) :
    Parcelable
//I miss typedefs and structs man, but i guess that's the closest we've got