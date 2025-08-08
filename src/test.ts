import { getAllStornos } from './sync';

async function runTests() {
    try {
        // Helper function to format dates
        const formatDate = (date: Date): string => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        };

        // Get current date and date after 30 days
        const today = new Date();
        const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Test Stornos endpoint
        console.log('\n=== Testing Stornos Endpoint ===\n');
        const stornos = await getAllStornos({
            periodFrom: formatDate(today),
            periodTo: formatDate(nextMonth),
            includeWaitingOptions: true,
            displayCurrency: 'DEFAULT'
        });
        console.log('Stornos Status:', stornos?.status);
        if (stornos?.reservations?.length > 0) {
            console.log('Number of Stornos:', stornos.reservations.length);
            const firstStorno = stornos.reservations[0];
            console.log('\nExample Storno:');
            console.log('ID:', firstStorno.id);
            console.log('UUID:', firstStorno.uuid);
            console.log('Status:', firstStorno.reservationStatus);
            console.log('Yacht ID:', firstStorno.yachtId);
            console.log('Period:', firstStorno.periodFrom, 'to', firstStorno.periodTo);
            console.log('Client:', firstStorno.client.name, firstStorno.client.surname);
            console.log('Price List Price:', firstStorno.priceListPrice);
            console.log('Currency:', firstStorno.currency);
        } else {
            console.log('No stornos found');
        }

    } catch (error) {
        console.error('Error during tests:', error);
    }
}

runTests()
    .then(() => console.log('\nTests completed'))
    .catch(error => console.error('\nTest failed:', error));