package tech.linuxcat.saes4

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Request
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.google.android.material.snackbar.Snackbar
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import tech.linuxcat.saes4.types.API
import tech.linuxcat.saes4.types.User

class LoginActivity : AppCompatActivity(){
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val loginButton = findViewById<Button>(R.id.button)
        val email = findViewById<EditText>(R.id.editTextTextPersonName)
        val password = findViewById<EditText>(R.id.editTextTextPersonName2)
        val registerButton = findViewById<Button>(R.id.button2)

        registerButton.setOnClickListener {
            startActivity(Intent(this,  RegisterActivity::class.java))
            finish()
        }

        val queue = Volley.newRequestQueue(this)
        loginButton.setOnClickListener { view ->
            queue.add(StringRequest(
                Request.Method.GET,
                API.getUser(email.text.toString()),
                {
                    try {
                        if (Json.decodeFromString<User>(it).password != password.text.toString()){
                            showError(view, "Wrong password!")
                        } else {
                            val sharedPref = this.getSharedPreferences("DATA", Context.MODE_PRIVATE)
                            sharedPref.edit().putString("email", email.text.toString()).commit()
                            startActivity(Intent(this, MainActivity::class.java))
                            finish()
                        }
                    } catch (e : Exception){
                        showError(view, "Erreur : Vérifiez votre connexion a internet!")
                    }
                },
                {
                    showError(view, "Utilisateur inexistant!")
                }
            ))

        }
    }

    fun showError(view : View, text : String){
        Snackbar.make(view, text, Snackbar.LENGTH_LONG).show()
    }
}