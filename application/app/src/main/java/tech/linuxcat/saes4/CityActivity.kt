package tech.linuxcat.saes4

import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.ListView
import android.widget.ProgressBar
import android.widget.TextView
import androidx.core.view.WindowCompat
import com.android.volley.Request
import com.android.volley.VolleyError
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.google.android.material.floatingactionbutton.FloatingActionButton
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import org.json.JSONObject
import tech.linuxcat.saes4.adapters.PlaceAdapter
import tech.linuxcat.saes4.databinding.ActivityCityBinding
import tech.linuxcat.saes4.types.*
import java.time.format.DateTimeFormatter

class CityActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        super.onCreate(savedInstanceState)
        var binding = ActivityCityBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setSupportActionBar(binding.toolbar3)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val sharedPref = this.getSharedPreferences("DATA", Context.MODE_PRIVATE)
        val email = sharedPref.getString("email", "")
        if (email==null || email==""){
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }

        val selected = intent.getParcelableExtra<SearchResult> ("selected")!!
        val fab = findViewById<FloatingActionButton>(R.id.floatingActionButton)
        val queue = Volley.newRequestQueue(this)
        queue.add(StringRequest(
            Request.Method.GET,
            API.getLikes(email!!),
            {
                var isFavorite=false
                val favs = Json.decodeFromString<List<Vol>>(it)
                for (f in favs){
                    if (f.id==selected.vol.id){
                        isFavorite=true
                        fab.setImageDrawable(resources.getDrawable(R.drawable.custom_like, this.theme))
                        break
                    }
                }
                fab.setOnClickListener{
                    val json = JSONObject()
                    json.put("email", email)
                    json.put("id", selected.vol.id)
                    isFavorite = !isFavorite
                    if (isFavorite){
                        queue.add(JsonObjectRequest(Request.Method.POST, API.postLike(), json, {},{}))
                        fab.setImageDrawable(resources.getDrawable(R.drawable.custom_like, this.theme))
                    } else {
                        queue.add(JsonObjectRequest(Request.Method.POST, API.postUnlike(), json, {},{}))
                        fab.setImageDrawable(resources.getDrawable(R.drawable.custom_heart, this.theme))
                    }

                }
            },
            {
                fab.visibility = View.INVISIBLE
            }
        ))




        val smallText = findViewById<TextView>(R.id.tv_fromto)
        smallText.text = "Vol de ${selected.vol.aeroid} à ${selected.city.nom}, prévu pour ${selected.vol.heurelocale}"
        val infoText = findViewById<TextView>(R.id.tv_voyage)
        infoText.text = "Vous volez a bord d'un ${selected.vol.model}, de la companie aérienne ${selected.vol.airline}"

        val placesView = findViewById<ListView>(R.id.lv_monuments)
        placesView.adapter = PlaceAdapter(this, 0,selected.city.lieux)
        placesView.setOnItemClickListener { parent, view, position, id ->
            val intent = Intent(this, PlaceActivity::class.java)
            intent.putExtra("place", selected.city.lieux[position])
            startActivity(intent)
        }
        findViewById<ProgressBar>(R.id.loading_places).visibility=View.INVISIBLE
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.menu_main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        return when (item.itemId) {
            R.id.action_settings -> true
            R.id.action_logout -> {
                val sharedPref = this.getSharedPreferences("DATA", Context.MODE_PRIVATE)
                sharedPref.edit().putString("email", null)
                startActivity(Intent(this, LoginActivity::class.java))
                finish()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }


}