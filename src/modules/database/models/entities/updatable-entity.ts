import { Column, UpdateDateColumn, BaseEntity } from "typeorm";
import { APP_CONSTANTS } from "src/modules/shared/util/app-constants";
import {AppUtilService} from "../../../shared/services/app-util.service";

export class UpdatableEntity extends BaseEntity {
  // ts-ignore
  @UpdateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
    name: "rec_upd_ts",
    default: () => AppUtilService.defaultISOTime(),
  })
  recUpdTs: string;

  @Column({
    name: "rec_usr_id",
    default: APP_CONSTANTS.COMMON.USER_ID,
    nullable: false,
  })
  recUpdUser: string;
}
