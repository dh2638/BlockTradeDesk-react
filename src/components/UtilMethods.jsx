export const utils = {
    convertPrice,
};

function convertPrice(price) {
    return new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(price)
}