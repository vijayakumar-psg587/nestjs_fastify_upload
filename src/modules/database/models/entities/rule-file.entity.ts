import { Entity, PrimaryColumn, Column } from "typeorm";
import { UpdatableEntity } from "./updatable-entity";

@Entity({ name: "t_rule_file" })
export class RuleFileEntity extends UpdatableEntity {
  @PrimaryColumn({
    type: "uuid",
    generated: "uuid",
    name: "id",
    nullable: false,
  })
  id: string;

  @Column({
    name: "name",
    type: "varchar",
    nullable: false,
  })
  name: string;

  @Column({
    name: "ext",
    type: "varchar",
    nullable: false,
  })
  ext: string;

  @Column({
    type: "bytea",
    name: "file",
    nullable: false,
  })
  file: Buffer;
}
