'use strict';

const { ZwaveDevice } = require('homey-meshdriver');

class ZM1621Device extends ZwaveDevice {

	onMeshInit() {
	  this.enableDebug();
	  this.log('ZM1621Device has been inited');

	  this._cancellationTimeout = this.getSetting('tamper_cancellation');

	  this.printNode();

	  this.registerCapability('measure_battery', 'BATTERY');
	  this.registerCapability('onoff', 'SWITCH_BINARY');

	  this.registerCapability('alarm_tamper', 'NOTIFICATION', {
	    reportParser: report => {
	      console.log('Notification register lambda: ', report);
	      if (report && report['Notification Type'] === 'Home Security' && report.hasOwnProperty('Event (Parsed)')) {
	        if (report[EVENT_PARSED] === 'Tampering, Product covering removed') {
	          setTimeout(() => {
	            this.setCapabilityValue('alarm_tamper', false);
	          }, this._cancellationTimeout * 1000);
	          return true;
	        }
	      }
	      return null;
	    },
	  });
	}

	onSettings(oldSettings, newSettings, changedKeys) {
	  if (changedKeys.includes('tamper_cancellation')) {
	    this._cancellationTimeout = this.getSetting('tamper_cancellation');
	  }
	  return super.onSettings(oldSettings, newSettings, changedKeys);
	}

}

module.exports = ZM1621Device;
