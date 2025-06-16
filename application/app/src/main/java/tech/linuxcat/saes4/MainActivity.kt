package tech.linuxcat.saes4

import android.app.DatePickerDialog
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import androidx.navigation.ui.AppBarConfiguration
import com.google.android.material.snackbar.Snackbar
import tech.linuxcat.saes4.databinding.ActivityMainBinding
import tech.linuxcat.saes4.types.SearchParams
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.*


class MainActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setSupportActionBar(binding.toolbar)
        val sharedPref = this.getSharedPreferences("DATA", Context.MODE_PRIVATE)
        val email = sharedPref.getString("email", "")


        if (email == ""){
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        val actv_depart = findViewById<AutoCompleteTextView>(R.id.actv_depart)
        val actv_arrive = findViewById<AutoCompleteTextView>(R.id.actv_arrive)
        val textDate = findViewById<EditText>(R.id.editTextDate)
        val searchButton = findViewById<Button>(R.id.searchButton)
        var targetDate : LocalDate = LocalDate.parse("01-01-1990", DateTimeFormatter.ofPattern("dd-MM-yyyy"))


        actv_depart.setAdapter(ArrayAdapter(this, android.R.layout.simple_list_item_1, CityList.l))
        actv_arrive.setAdapter(ArrayAdapter(this, android.R.layout.simple_list_item_1, CityList.l))
        actv_depart.threshold = 3
        actv_arrive.threshold = 3

        textDate.setOnFocusChangeListener { view: View, b: Boolean ->

            if (!b)return@setOnFocusChangeListener //Now THAT is one of the best features of kotlin
            val c = Calendar.getInstance()
            val year = c.get(Calendar.YEAR)
            val month = c.get(Calendar.MONTH)
            val day = c.get(Calendar.DAY_OF_MONTH)

            val datePickerDialog = DatePickerDialog(this, { nview, newYear, monthOfYear, dayOfMonth ->
                textDate.setText(dayOfMonth.toString().padStart(2, '0') + "-" + (monthOfYear+1).toString().padStart(2, '0') + "-" +newYear)
                targetDate = LocalDate.parse(textDate.text.toString(), DateTimeFormatter.ofPattern("dd-MM-yyyy"))
            },year, month, day)

            datePickerDialog.datePicker.minDate = c.timeInMillis

            datePickerDialog.show()
        }

        searchButton.setOnClickListener {
            val imm: InputMethodManager = this.getSystemService(INPUT_METHOD_SERVICE) as InputMethodManager
            imm.hideSoftInputFromWindow(it.windowToken, 0)
            var errMsg = ""
            if (!CityList.isin(actv_depart.text.toString())) errMsg = "La ville de départ est invalide!"
            if (errMsg.isEmpty() && !CityList.isin(actv_arrive.text.toString())) errMsg = "La ville d'arrivée est invalide!"
            if (errMsg.isEmpty() && actv_arrive.text.toString() == actv_depart.text.toString()) errMsg = "La ville d'arrivée ne peut pas être la même que la ville de départ!"
            if (errMsg.isEmpty() && textDate.text.toString().isEmpty()) errMsg = "Pas de date sélectionnée!"
            if (errMsg.isNotEmpty()){
                Snackbar.make(it, errMsg, Snackbar.LENGTH_LONG).show()
                return@setOnClickListener
            }
            var searchParams = SearchParams(actv_depart.text.toString(), actv_arrive.text.toString(), targetDate)
            val intent = Intent(this, SearchActivity::class.java)
            intent.putExtra("params", searchParams)
            startActivity(intent)
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


}