export class AddressUtils {

    static get(data) {
        let address = data.address;
        // let display = data.display_name;
        let addresses = [
            address.building,
            address.house_number,
            address.hardware,
            address.path,
            address.village,
            address.road,
            address.town,
            address.county,
            address.city,
            address.state,
            address.postcode,
            address.country
        ]
        let display = '';
        addresses.forEach(address => {
            if (address) {
                display = display + address + ', ';
            }
            if (address == addresses[addresses.length - 1]) {
                display = display.slice(0, -2) + '.';
            }

        });
        return display;
    }
}