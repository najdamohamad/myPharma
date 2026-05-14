# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Add medicine by barcode

In the app, tap **+** → **Scan barcode** to scan a medicine box barcode. The app will:

1. Look up the product name (UPCItemDB trial API)
2. Fetch 3 candidate box images from the web (DuckDuckGo)
3. Run background removal and show cutouts for you to pick

**Requirements for barcode → candidates flow:**

1. Install Python deps: `pip install -r boxscanner/medicine-cutouts/requirements.txt` and `pip install -r boxscanner/medicine-images/requirements.txt`
2. Start the boxscanner API: `npm run api` (in a separate terminal)
3. For physical device: set `EXPO_PUBLIC_BOXSCANNER_API=http://YOUR_IP:3912` so the app can reach the API

## Medicine cutouts (boxscanner)

To process raw medicine photos into transparent PNG cutouts for the cabinet:

1. Install Python dependencies: `pip install -r boxscanner/medicine-cutouts/requirements.txt`
2. Get images: either place raw photos (jpg/png) in `boxscanner/raw/`, or run `npm run fetch-images -- "Medicine Name"` to fetch top 3 candidate images from the web
3. Run: `npm run process-cutouts`

Output goes to `assets/images/medicines/`. See [boxscanner/README.md](boxscanner/README.md) for details.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
