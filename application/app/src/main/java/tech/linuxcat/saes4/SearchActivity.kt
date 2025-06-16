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
import android.widget.Toast
import androidx.core.view.WindowCompat
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.google.android.material.snackbar.Snackbar
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import tech.linuxcat.saes4.adapters.PlaceAdapter
import tech.linuxcat.saes4.adapters.SearchResultAdapter
import tech.linuxcat.saes4.databinding.ActivitySearchBinding
import tech.linuxcat.saes4.types.*
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.Date

class SearchActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        super.onCreate(savedInstanceState)
        var binding = ActivitySearchBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setSupportActionBar(binding.toolbar2)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)


        val params = intent.getParcelableExtra<SearchParams>("params")
        val tv_resume = findViewById<TextView>(R.id.tv_resume)
        tv_resume.setText("Recherche d'un voyage de "+params!!.villeDepart+" à "+params.villeArrivee+", départ le "+params.dateDepart.format(DateTimeFormatter.ofPattern("dd-MM-yyyy")))
        val queue = Volley.newRequestQueue(this)

        //Get airports near city
        val airports = StringRequest(
            Request.Method.GET,
            API.getAirports(params.villeDepart),
            { response ->
                val airports = Json.decodeFromString<List<Airport>>(response)
                val flights = mutableListOf<Vol>()
                var finishedAirports = 0
                for (airport in airports){
                    //Get flights per airport
                    queue.add(StringRequest(
                        Request.Method.GET,
                        API.getFlights(airport.id, params.dateDepart.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")), params.villeArrivee),
                        {
                            finishedAirports++
                            flights.addAll(Json.decodeFromString(it))
                            if (finishedAirports == airports.size){
                                val results : MutableList<SearchResult> = mutableListOf()
                                onAllAirportsParsed(flights, queue, results)
                            }
                        },
                        {
                            finishedAirports++
                            if (finishedAirports == airports.size){
                                val results : MutableList<SearchResult> = mutableListOf()
                                onAllAirportsParsed(flights, queue, results)
                            }
                        }
                    ))
                }
            },
            {Snackbar.make(this.findViewById(R.id.rootOfSearch), "Erreur ! Vérifiez votre connexion a internet.", Snackbar.LENGTH_LONG)}
        )
        queue.add(airports)

        //Get flights from api (here its placeholder data)
        /*val TEST_DO_NOT_SHIP = listOf(
            Vol("U2 4813", "Paris",  "easyJet", "1", "Airbus A320", "LFPO","2023-05-04 08:00+02:00"),
            Vol("U2 1337", "Geneva","easyJet","1","Airbus A320","LFPO", "2023-05-04 08:20+02:00")
        )*/


    }

    fun onAllAirportsParsed(flights : MutableList<Vol>, queue : RequestQueue, results : MutableList<SearchResult>){

        var done = 0
        val listOfCities = findViewById<ListView>(R.id.listOfCities)

        for (v in flights){
            val req = StringRequest(
                Request.Method.GET, API.getCity(v.destination),
                //Request for city
                { res ->
                    done++
                    try {
                        val cityInfo = Json.decodeFromString<City>(res)
                        results.add(SearchResult(cityInfo, v))

                    } catch (e : Exception){
                        Toast.makeText(this, "Erreur!", Toast.LENGTH_SHORT).show()
                    }
                    if (done==flights.size){
                        listOfCities.adapter = SearchResultAdapter(this, R.layout.search_result, results)
                        findViewById<ProgressBar>(R.id.progressBar).visibility= View.INVISIBLE
                        listOfCities.setOnItemClickListener { parent, view, position, id ->
                            val intent = Intent(this, CityActivity::class.java)
                            intent.putExtra("selected",results[position])
                            startActivity(intent)
                        }
                    }
                }, {
                    done++
                    if (done == flights.size){
                        findViewById<ProgressBar>(R.id.progressBar).visibility= View.INVISIBLE
                        if (results.isEmpty()){
                            Snackbar.make(this.findViewById(R.id.rootOfSearch), "Aucun résultat!", Snackbar.LENGTH_LONG)
                        }
                    }
                }
            )
            queue.add(req)
        }
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