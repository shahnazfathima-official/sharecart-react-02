# ShareCart Backend

This is the fully functional Node/Express backend for ShareCart.

## Setup Instructions

1. **Install Dependencies**
   Navigate to this backend folder and run:
   ```bash
   npm install
   ```

2. **Supabase Database Setup**
   * Create a new Supabase project.
   * Go to "SQL Editor" in the Supabase dashboard.
   * Copy the contents of `database.sql` and run it to create the required tables.
   * Go to "Project Settings" -> "Database" and copy the "Connection string (URI)".

3. **Configure Environment Variables**
   * Create a `.env` file in the root of the `backend` directory.
   * Add your connection string and desired port:
     ```env
     DB_URL=YOUR_SUPABASE_CONNECTION_STRING
     PORT=5000
     ```

4. **Run the Server**
   ```bash
   npm run dev
   # or
   npm start
   ```

## Render Deployment

To deploy this backend to Render.com:
1. Push this code to a GitHub repository.
2. Log into Render and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the following build and start commands:
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
5. In the Render "Environment" settings, add the `DB_URL` environment variable (using your Supabase connection string).
   * Note: Render will automatically assign a `PORT` variable, and Express is configured to listen to `process.env.PORT`.

## API Examples (Postman/Curl)

### 1. Register a Vendor
```bash
curl -X POST http://localhost:5000/vendors \
-H "Content-Type: application/json" \
-d '{"name": "John Doe", "shop_name": "Johns Groceries", "location": "Downtown"}'
```

### 2. List Vendors
```bash
curl http://localhost:5000/vendors
```

### 3. Add a Product
*(Use a valid `vendor_id` obtained from the vendor registration)*
```bash
curl -X POST http://localhost:5000/products \
-H "Content-Type: application/json" \
-d '{
  "name": "Fresh Milk",
  "quantity": 10,
  "price": 2.50,
  "expiry_date": "2026-05-01",
  "vendor_id": 1,
  "is_surplus": true
}'
```

### 4. Get Surplus Products (Near Expiry Filter)
```bash
# Get all surplus
curl http://localhost:5000/surplus

# Get surplus near expiry (expires within 7 days)
curl http://localhost:5000/surplus?near_expiry=true
```

### 5. Request a Surplus Item
```bash
curl -X POST http://localhost:5000/request-product \
-H "Content-Type: application/json" \
-d '{
  "product_id": 1,
  "requester_vendor_id": 2
}'
```
