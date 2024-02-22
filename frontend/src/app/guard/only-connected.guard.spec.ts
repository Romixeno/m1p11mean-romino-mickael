import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { onlyConnectedGuard } from './only-connected.guard';

describe('onlyConnectedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => onlyConnectedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
