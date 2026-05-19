export default class PassiveBastiao {
    constructor() {
        this.calor = 0; // Heat resource (0-100%)
        this.maxCalor = 100;
        this.isSuperaquecido = false; // Overheated state
    }

    // Accumulate heat when taking damage
    acumularCalorDano(quantidade) {
        this.calor = Math.min(this.calor + quantidade, this.maxCalor);
        if (this.calor >= this.maxCalor) {
            this.entrarSuperaquecimento();
        }
    }

    // Accumulate heat when attacking
    acumularCalorAtaque(quantidade) {
        this.calor = Math.min(this.calor + quantidade, this.maxCalor);
        if (this.calor >= this.maxCalor) {
            this.entrarSuperaquecimento();
        }
    }

    // Consume heat for abilities
    consumirCalor(quantidade) {
        if (this.calor >= quantidade) {
            this.calor -= quantidade;
            if (this.isSuperaquecido && this.calor < this.maxCalor) {
                this.sairSuperaquecimento();
            }
            return true;
        }
        return false;
    }

    // Enter overheated state (100% heat)
    entrarSuperaquecimento() {
        this.isSuperaquecido = true;
        this.calor = this.maxCalor;
    }

    // Exit overheated state
    sairSuperaquecimento() {
        this.isSuperaquecido = false;
    }

    // Get heat percentage for UI display
    getCalorPercentual() {
        return (this.calor / this.maxCalor) * 100;
    }

    // Reset heat (for respawn or other events)
    resetarCalor() {
        this.calor = 0;
        this.isSuperaquecido = false;
    }
}
