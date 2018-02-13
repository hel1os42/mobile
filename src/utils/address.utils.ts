export class AddressUtils {

    static get(data) {
        if (!data.error) {
            let addrData = data.address;
            // let display = data.display_name;
            let addresses = [
                addrData.building,
                addrData.house_number,
                addrData.hardware,
                addrData.path,
                addrData.village,
                addrData.road,
                addrData.town,
                addrData.county,
                addrData.city,
                addrData.state,
                addrData.postcode,
                addrData.country
            ]
            let display = '';
            let empty = true;
            addresses.forEach(address => {
                if (address) {
                    if (addrData.country !== address) {
                        empty = false;
                    }
                    display = display + address + ', ';
                }
                if (address == addresses[addresses.length - 1]) {
                    display = display.slice(0, -2) + '.';
                }
            });
            display = empty ? undefined : display;
            return display;
        }
        else {
            return undefined;
        }
    }
}