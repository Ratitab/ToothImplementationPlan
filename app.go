package main

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/mongo"
)

// App struct
type App struct {
	ctx           context.Context
	client        *mongo.Client
	updateVersion string
	downloadURl   string
}

// NewApp creates a new App application struct
func NewApp() *App {
	app := &App{}
	app.CheckVerisonOnStartup()
	return app
}

func (a *App) CheckVerisonOnStartup() {
	version, url, err := a.CheckAppVersion()
	fmt.Println("AKAVAART", version)
	if err != nil {
		fmt.Println("Error checking version: ", err)
		return
	}

	currentVersion := "1.0"
	if version != currentVersion {
		a.updateVersion = version
		a.downloadURl = url
	}
}

func (a *App) GetUpdateStatus() (bool, string) {
	return a.updateVersion != "", a.updateVersion
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	// serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	// clientOptions := options.Client().ApplyURI("mongodb+srv://ratitabidze:ertidancxramde@cluster0.z8j3nkw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").SetServerAPIOptions(serverAPI)
	// client, err := mongo.Connect(ctx, clientOptions)
	// if err != nil {
	// 	log.Fatal("Error connecting to MongoDB: ", err)
	// }

	// err = client.Ping(ctx, readpref.Primary())
	// if err != nil {
	// 	log.Fatal("Error pinging MongoDB: ", err)
	// }

	// a.client = client
	// log.Println("Connected to MongoDB")
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Implantation Plan for %s", name)
}
