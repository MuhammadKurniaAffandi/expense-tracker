import React, { useState, useEffect } from 'react';
import AddTransaction from './components/AddTransaction';
import Footer from './components/Footer';
import Header from './components/Header';
import SaldoBox from './components/SaldoBox';
import Transaction from './components/Transaction';

// URL Realtime Database
let url =
  'https://mukura-expense-tracker-default-rtdb.asia-southeast1.firebasedatabase.app/transactions.json';

const App = () => {
  // state untuk transcations
  const [transactions, setTransactions] = useState([]);
  const [submitCount, setSubmitCount] = useState(0);

  // useEffect untuk mengakses data dari API Realtime Database (firebase)
  useEffect(() => {
    const myFetch = async () => {
      try {
        let response = await fetch(url);
        if (!response.ok) {
          throw new Error(response.status);
        }
        let responseData = await response.json();

        const initTransactions = [];
        for (const key in responseData) {
          initTransactions.push({
            id: key,
            tanggal: responseData[key].tanggal,
            keterangan: responseData[key].keterangan,
            nominal: responseData[key].nominal,
          });
        }

        // atur ulang urutan transaction agar tanggal terkecil di bagian atas
        initTransactions.sort((a, b) => a.tanggal - b.tanggal);
        setTransactions(initTransactions);
      } catch (error) {
        console.log(`useEffect , Terjadi gangguan dengan pesan: "${error}"`);
      }
    };
    myFetch();
  }, [submitCount]);

  // handler untuk menambah data transaction,
  // akan di-trigger dari komponen AddTransaction
  const handleTambahTransaction = async (data) => {
    // Kirim data ke server (firebase)
    try {
      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const newTransactions = [...transactions, data];

      // atur ulang urutan transaction agar tanggal terkecil di bagian atas
      newTransactions.sort((a, b) => a.tanggal - b.tanggal);
      setTransactions(newTransactions);

      if (!response.ok) {
        throw new Error(response.status);
      }
      setSubmitCount(submitCount + 1);
    } catch (error) {
      console.log(
        `handleTambahTransaction , Terjadi gangguan dengan pesan: "${error}"`
      );
    }
  };

  // handler untuk menghapus data transaction di komponen AddTransaction
  const handleHapusTransaction = async (e) => {
    // Rangkai alamat URL agar berisi id data yang dihapus
    let url = `https://mukura-expense-tracker-default-rtdb.asia-southeast1.firebasedatabase.app/transactions/${e.target.id}.json`;

    // Kirim data ke server (firebase)
    try {
      let response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(response.status);
      }
      setSubmitCount(submitCount - 1);
    } catch (error) {
      console.log(
        `handleHapusTransaction , Terjadi gangguan dengan pesan: "${error}"`
      );
    }
  };

  return (
    <React.Fragment>
      <Header />
      <SaldoBox transactions={transactions} />
      <Transaction
        transactions={transactions}
        onHapusTransaction={handleHapusTransaction}
      />
      <AddTransaction onTambahTransaction={handleTambahTransaction} />
      <Footer />
    </React.Fragment>
  );
};

export default App;
