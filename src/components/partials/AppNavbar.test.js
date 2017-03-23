import React from 'react';
import AppNavbar from './AppNavbar.jsx';
import { expect } from 'chai';
import { shallow } from 'enzyme';

describe('<AppNavbar />', () => {

    it("should contains a Toolbar", () => {
        expect(shallow(<AppNavbar />).find('Toolbar')).to.have.length(1);
    });

});