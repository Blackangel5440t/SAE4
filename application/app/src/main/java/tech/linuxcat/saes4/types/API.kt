package tech.linuxcat.saes4.types

import android.content.Context
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import kotlinx.coroutines.CoroutineStart
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

class API {
    companion object{
        private val apiKey : String? = null
        private const val API_URL = "http://192.168.1.19:3000"

        /**
         * Obtenir l'URL de l'API qui nous donne la ville..
         * @param nom le nom de la ville a rechercher.
         * @return L'url a appeler.
         */
        fun getCity(nom : String) : String{
            return "$API_URL/ville/$nom"
        }

        fun getAirports(city : String) : String{
            return "$API_URL/airports/$city"
        }

        fun getFlights(icao : String, date : String, destination : String) : String{
            return "$API_URL/proposal/$icao/$date/$destination"
        }

        fun getFlights(icao: String, date: String) : String{
            return "$API_URL/proposal/$icao/$date"
        }

        fun getUser(email : String) : String{
            return "$API_URL/user/$email"
        }
        fun postUser() : String{
            return "$API_URL/user"
        }
        fun getLikes(email: String) : String{
            return "$API_URL/user/likes/$email"
        }
        fun postUnlike() : String{
            return "$API_URL/unlike"
        }
        fun postLike() : String{
            return "$API_URL/like"
        }
    }
}